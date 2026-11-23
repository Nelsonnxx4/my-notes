import { useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import { sanitizeNoteHtml } from "@/lib/sanitizeHtml";

interface Props {
  defaultContent?: string;
  onChange: (html: string) => void;
  onEditorReady: (editor: Editor | null) => void;
}

/**
 * Structured rich-text editing replaces the browser's deprecated execCommand API.
 * Tiptap owns the document model; only sanitised HTML crosses the app/API boundary.
 */
const NoteContentEditor: React.FC<Props> = ({
  defaultContent = "",
  onChange,
  onEditorReady,
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        protocols: ["http", "https", "mailto"],
      }),
      Image.configure({ allowBase64: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: sanitizeNoteHtml(defaultContent),
    editorProps: {
      attributes: {
        "aria-label": "Note content",
        "data-note-editor": "true",
        class:
          "min-h-[58vh] w-full pb-28 text-[1rem] leading-8 text-[var(--app-text)] outline-none",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(sanitizeNoteHtml(activeEditor.getHTML()));
    },
  });

  useEffect(() => {
    onEditorReady(editor);
    return () => onEditorReady(null);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor) return;
    const nextContent = sanitizeNoteHtml(defaultContent);
    if (nextContent !== editor.getHTML()) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [defaultContent, editor]);

  return <EditorContent editor={editor} />;
};

export default NoteContentEditor;
