import { useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

import { sanitizeEditorHtml } from "@/utils/editorHtml";

interface Props {
  value: string;
  onChange: (html: string) => void;
  onEditorReady?: (editor: Editor | null) => void;
}

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Underline,
  Link.configure({
    autolink: true,
    defaultProtocol: "https",
    openOnClick: false,
    HTMLAttributes: {
      class: "text-green-700 underline underline-offset-2",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  Image.configure({
    allowBase64: false,
    HTMLAttributes: {
      class: "not-lify-editor-image",
    },
  }),
  Placeholder.configure({
    placeholder: "Start writing...",
  }),
];

const editorClassName =
  "not-lify-editor w-full min-h-[60vh] bg-transparent leading-8 outline-none text-gray-800";

const NoteContentEditor: React.FC<Props> = ({
  value,
  onChange,
  onEditorReady,
}) => {
  const editor = useEditor(
    {
      extensions,
      content: sanitizeEditorHtml(value),
      editorProps: {
        attributes: {
          "aria-label": "Note content",
          class: editorClassName,
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        onChange(sanitizeEditorHtml(currentEditor.getHTML()));
      },
    },
    [],
  );

  useEffect(() => {
    onEditorReady?.(editor);

    return () => onEditorReady?.(null);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor) return;

    const sanitizedValue = sanitizeEditorHtml(value);

    if (sanitizedValue !== editor.getHTML()) {
      editor.commands.setContent(sanitizedValue, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <>
      <EditorContent editor={editor} />
      <style>{`
        .not-lify-editor {
          font-size: var(--editor-font-size, 1rem);
        }

        .not-lify-editor :first-child {
          margin-top: 0;
        }

        .not-lify-editor h1 {
          color: #111827;
          font-size: 2rem;
          font-weight: 750;
          line-height: 1.15;
          margin: 1.5rem 0 0.75rem;
        }

        .not-lify-editor h2 {
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.25;
          margin: 1.25rem 0 0.625rem;
        }

        .not-lify-editor h3 {
          color: #374151;
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 1rem 0 0.5rem;
        }

        .not-lify-editor p {
          margin: 0.625rem 0;
        }

        .not-lify-editor ul {
          list-style: disc;
          padding-left: 1.5rem;
        }

        .not-lify-editor ol {
          list-style: decimal;
          padding-left: 1.5rem;
        }

        .not-lify-editor blockquote {
          border-left: 3px solid #d1d5db;
          color: #4b5563;
          padding-left: 1rem;
        }

        .not-lify-editor pre {
          background: #111827;
          border-radius: 0.75rem;
          color: #f9fafb;
          overflow-x: auto;
          padding: 0.875rem 1rem;
        }

        .not-lify-editor code {
          background: #f3f4f6;
          border-radius: 0.375rem;
          padding: 0.125rem 0.25rem;
        }

        .not-lify-editor pre code {
          background: transparent;
          padding: 0;
        }

        .not-lify-editor img {
          background: #f9fafb;
          border-radius: 1rem;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
          display: block;
          height: auto;
          margin: 1rem auto;
          max-height: 28rem;
          max-width: min(100%, 46rem);
          object-fit: contain;
          width: auto;
        }

        .not-lify-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default NoteContentEditor;
