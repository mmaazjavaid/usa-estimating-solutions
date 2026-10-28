'use client';

import { useEffect, useRef, useState } from 'react';
import { uploadAdminImage } from '@/lib/admin-upload-client';
import {
  cleanRichHtml,
  formatRichHtmlSource,
  looksLikeHtmlSource,
  normalizeRichHref,
  plainTextToRichHtml,
} from '@/lib/cms-rich-html';

type CmsRichContentEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Show "Upload image" / "Image URL" toolbar buttons. */
  allowImages?: boolean;
};

/**
 * WYSIWYG field for rich CMS copy (the "Rich content" section and blog bodies). Pasting from Google
 * Docs, Word, a web page or raw HTML code keeps headings, paragraphs, spacing, lists, links and
 * images; the editor surface uses the same `.cms-rich-content` styles as the live site so what the
 * admin sees is what gets published. The "HTML" toggle edits the markup directly.
 */
export function CmsRichContentEditor({
  label,
  value,
  onChange,
  allowImages = false,
}: CmsRichContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  /** Last HTML we emitted — lets us skip resetting the DOM (and the caret) for our own updates. */
  const lastEmitted = useRef<string | null>(null);
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [source, setSource] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || value === lastEmitted.current) {
      return;
    }
    editor.innerHTML = value || '';
    lastEmitted.current = value;
  }, [value]);

  function emit() {
    const html = cleanRichHtml(editorRef.current?.innerHTML ?? '');
    lastEmitted.current = html;
    onChange(html);
  }

  function run(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emit();
  }

  function toggleMode() {
    if (mode === 'visual') {
      setSource(formatRichHtmlSource(value || ''));
      setMode('html');
    } else {
      setMode('visual');
    }
  }

  function handleSourceChange(raw: string) {
    setSource(raw);
    // Keep the stored value (and the hidden visual editor) clean while the raw markup is edited.
    const html = cleanRichHtml(raw);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
    lastEmitted.current = html;
    onChange(html);
  }

  function addLink() {
    // The prompt steals focus; remember the selection so the link lands on the selected words.
    const selection = window.getSelection();
    const range =
      selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)
        ? selection.getRangeAt(0).cloneRange()
        : null;
    const input = window.prompt('Link URL or internal path (e.g. /services or https://example.com)');
    if (input === null) {
      return;
    }
    const href = normalizeRichHref(input);
    if (!href) {
      window.alert('Please enter a valid link (a /path, https://…, mailto: or tel:).');
      return;
    }
    editorRef.current?.focus();
    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (!range || range.collapsed) {
      // Nothing selected: insert the URL itself as the link text.
      const text = input.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;');
      document.execCommand('insertHTML', false, `<a href="${href.replace(/"/g, '&quot;')}">${text}</a>`);
    } else {
      document.execCommand('createLink', false, href);
    }
    emit();
  }

  function addImageFromUrl() {
    const url = window.prompt('Image URL (https://… or /path)')?.trim();
    if (!url) {
      return;
    }
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
      window.alert('Please enter an image URL starting with https:// or /.');
      return;
    }
    run('insertImage', url);
  }

  function uploadImage(file: File) {
    setImageUploading(true);
    void uploadAdminImage(file)
      .then((url) => run('insertImage', url))
      .catch((err) => {
        window.alert(err instanceof Error ? err.message : 'Upload failed');
      })
      .finally(() => {
        setImageUploading(false);
        if (imageFileRef.current) {
          imageFileRef.current.value = '';
        }
      });
  }

  const isHtml = mode === 'html';

  return (
    <div className="space-y-1">
      <span className="text-xs text-zinc-400">{label}</span>
      <div className="flex flex-wrap gap-1 rounded-t border border-b-0 border-zinc-600 bg-zinc-900 p-1.5">
        {isHtml ? null : (
          <>
            <ToolbarButton label="Paragraph" onClick={() => run('formatBlock', 'p')} />
            <ToolbarButton label="H1" onClick={() => run('formatBlock', 'h1')} />
            <ToolbarButton label="H2" onClick={() => run('formatBlock', 'h2')} />
            <ToolbarButton label="H3" onClick={() => run('formatBlock', 'h3')} />
            <ToolbarButton label="H4" onClick={() => run('formatBlock', 'h4')} />
            <Divider />
            <ToolbarButton label="B" title="Bold" className="font-bold" onClick={() => run('bold')} />
            <ToolbarButton label="I" title="Italic" className="italic" onClick={() => run('italic')} />
            <ToolbarButton label="U" title="Underline" className="underline" onClick={() => run('underline')} />
            <Divider />
            <ToolbarButton label="• List" onClick={() => run('insertUnorderedList')} />
            <ToolbarButton label="1. List" onClick={() => run('insertOrderedList')} />
            <ToolbarButton label="Quote" onClick={() => run('formatBlock', 'blockquote')} />
            <Divider />
            <ToolbarButton label="Link" onClick={addLink} />
            <ToolbarButton label="Unlink" onClick={() => run('unlink')} />
            {allowImages ? (
              <>
                <ToolbarButton
                  label={imageUploading ? 'Uploading…' : 'Upload image'}
                  disabled={imageUploading}
                  onClick={() => imageFileRef.current?.click()}
                />
                <ToolbarButton label="Image URL" onClick={addImageFromUrl} />
              </>
            ) : null}
            <ToolbarButton label="Clear format" onClick={() => run('removeFormat')} />
          </>
        )}
        <ToolbarButton
          label={isHtml ? '← Visual editor' : '</> HTML'}
          title={isHtml ? 'Back to the visual editor' : 'Edit or paste raw HTML'}
          className={`ml-auto ${isHtml ? 'bg-zinc-700' : ''}`}
          onClick={toggleMode}
        />
      </div>
      {allowImages ? (
        <input
          ref={imageFileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadImage(file);
            }
          }}
        />
      ) : null}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => document.execCommand('defaultParagraphSeparator', false, 'p')}
        onInput={emit}
        onPaste={(e) => {
          e.preventDefault();
          const html = e.clipboardData.getData('text/html');
          const text = e.clipboardData.getData('text/plain');
          // HTML code copied from a code editor arrives as plain text (plus a syntax-highlighted
          // text/html copy), so check the plain text first and render the markup it contains.
          const cleaned = looksLikeHtmlSource(text)
            ? cleanRichHtml(text)
            : html
              ? cleanRichHtml(html)
              : plainTextToRichHtml(text);
          if (cleaned) {
            document.execCommand('insertHTML', false, cleaned);
            emit();
          }
        }}
        className={`cms-rich-content min-h-[320px] max-h-[55vh] overflow-y-auto rounded-b border border-zinc-600 bg-black px-4 py-3 text-sm text-white/80 outline-none focus:border-zinc-400 ${isHtml ? 'hidden' : ''}`}
      />
      {isHtml ? (
        <textarea
          value={source}
          onChange={(e) => handleSourceChange(e.target.value)}
          spellCheck={false}
          placeholder="<h2>Heading</h2>&#10;<p>Paste or write HTML here…</p>"
          className="block min-h-[320px] max-h-[55vh] w-full resize-y rounded-b border border-zinc-600 bg-black px-4 py-3 font-mono text-xs leading-relaxed text-zinc-200 outline-none focus:border-zinc-400"
        />
      ) : null}
      <p className="text-[11px] leading-snug text-zinc-500">
        Paste from Google Docs, Word, any web page or raw HTML code — headings, paragraphs, spacing,
        lists, links and images are kept. Fonts, colors and classes are replaced with the site&apos;s
        styling; scripts and embeds are removed.
      </p>
    </div>
  );
}

function ToolbarButton({
  label,
  title,
  className,
  disabled,
  onClick,
}: {
  label: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title ?? label}
      disabled={disabled}
      // mousedown keeps the text selection inside the editor while the command runs
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 ${className ?? ''}`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 w-px self-stretch bg-zinc-700" aria-hidden />;
}
