'use client';

import { useEffect, useRef } from 'react';
import { cleanRichHtml, normalizeRichHref, plainTextToRichHtml } from '@/lib/cms-rich-html';

type CmsRichContentEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

/**
 * WYSIWYG field for the "Rich content" section. Pasting from Google Docs, Word or a web page keeps
 * headings, paragraphs, spacing, lists and links; the editor surface uses the same
 * `.cms-rich-content` styles as the live site so what the admin sees is what gets published.
 */
export function CmsRichContentEditor({ label, value, onChange }: CmsRichContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  /** Last HTML we emitted — lets us skip resetting the DOM (and the caret) for our own updates. */
  const lastEmitted = useRef<string | null>(null);

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

  return (
    <div className="space-y-1">
      <span className="text-xs text-zinc-400">{label}</span>
      <div className="flex flex-wrap gap-1 rounded-t border border-b-0 border-zinc-600 bg-zinc-900 p-1.5">
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
        <ToolbarButton label="Clear format" onClick={() => run('removeFormat')} />
      </div>
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
          const cleaned = html ? cleanRichHtml(html) : plainTextToRichHtml(text);
          if (cleaned) {
            document.execCommand('insertHTML', false, cleaned);
            emit();
          }
        }}
        className="cms-rich-content min-h-[320px] max-h-[55vh] overflow-y-auto rounded-b border border-zinc-600 bg-black px-4 py-3 text-sm text-white/80 outline-none focus:border-zinc-400"
      />
      <p className="text-[11px] leading-snug text-zinc-500">
        Paste from Google Docs, Word or any web page — headings, paragraphs, spacing, lists and links
        are kept. Fonts and colors are replaced with the site&apos;s styling.
      </p>
    </div>
  );
}

function ToolbarButton({
  label,
  title,
  className,
  onClick,
}: {
  label: string;
  title?: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title ?? label}
      // mousedown keeps the text selection inside the editor while the command runs
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800 ${className ?? ''}`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 w-px self-stretch bg-zinc-700" aria-hidden />;
}
