'use client';

import { useEffect, useRef, useState } from 'react';
import { uploadAdminImage } from '@/lib/admin-upload-client';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  function applyCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || '');
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <ToolbarButton label="Bold" onClick={() => applyCommand('bold')} />
        <ToolbarButton label="Italic" onClick={() => applyCommand('italic')} />
        <ToolbarButton label="H1" onClick={() => applyCommand('formatBlock', 'h1')} />
        <ToolbarButton label="H2" onClick={() => applyCommand('formatBlock', 'h2')} />
        <ToolbarButton
          label="UL"
          onClick={() => applyCommand('insertUnorderedList')}
        />
        <ToolbarButton
          label="OL"
          onClick={() => applyCommand('insertOrderedList')}
        />
        <ToolbarButton
          label="Link"
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              applyCommand('createLink', url);
            }
          }}
        />
        <ToolbarButton
          label={imageUploading ? 'Uploading…' : 'Upload image'}
          onClick={() => imageFileRef.current?.click()}
          disabled={imageUploading}
        />
        <input
          ref={imageFileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) {
              return;
            }
            setImageUploading(true);
            void uploadAdminImage(file)
              .then((url) => {
                applyCommand('insertImage', url);
              })
              .catch((err) => {
                window.alert(err instanceof Error ? err.message : 'Upload failed');
              })
              .finally(() => {
                setImageUploading(false);
                e.target.value = '';
              });
          }}
        />
        <ToolbarButton
          label="Image URL"
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) {
              applyCommand('insertImage', url);
            }
          }}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        className="min-h-[240px] rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-white outline-none"
      />
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
