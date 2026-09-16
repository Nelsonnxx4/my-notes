import { useEffect, useReducer, useState } from "react";
import {
  Bold,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Underline,
  UploadCloud,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
  onInsertImage: () => void;
  isUploadingImage?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onInsertImage,
  isUploadingImage = false,
}) => {
  const [, refresh] = useReducer((count: number) => count + 1, 0);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  useEffect(() => {
    if (!editor) return;

    const update = () => refresh();

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const disabled = !editor;

  const tools = [
    {
      label: "Bold",
      icon: Bold,
      active: () => editor?.isActive("bold") ?? false,
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: () => editor?.isActive("italic") ?? false,
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      icon: Underline,
      active: () => editor?.isActive("underline") ?? false,
      run: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Heading 1",
      icon: Heading1,
      active: () => editor?.isActive("heading", { level: 1 }) ?? false,
      run: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Heading 2",
      icon: Heading2,
      active: () => editor?.isActive("heading", { level: 2 }) ?? false,
      run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Bullet list",
      icon: List,
      active: () => editor?.isActive("bulletList") ?? false,
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      active: () => editor?.isActive("orderedList") ?? false,
      run: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      icon: Quote,
      active: () => editor?.isActive("blockquote") ?? false,
      run: () => editor?.chain().focus().toggleBlockquote().run(),
    },
  ];

  function openLinkModal() {
    if (!editor) return;

    const currentHref = editor.getAttributes("link").href as string | undefined;

    setLinkValue(currentHref ?? "");
    setLinkModalOpen(true);
  }

  function applyLink() {
    if (!editor) return;

    const href = linkValue.trim();

    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkModalOpen(false);
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href })
      .run();

    setLinkModalOpen(false);
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkValue("");
    setLinkModalOpen(false);
  }

  return (
    <>
      {linkModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/20 px-4 pb-36 md:items-center md:pb-0"
          role="dialog"
          aria-modal="true"
          aria-label="Insert link"
          onMouseDown={() => setLinkModalOpen(false)}
        >
          <form
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              applyLink();
            }}
          >
            <label
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500"
              htmlFor="editor-link-url"
            >
              Link URL
            </label>
            <input
              autoFocus
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-green-950"
              id="editor-link-url"
              placeholder="https://example.com"
              type="url"
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
            />
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-950/30"
                disabled={!editor?.isActive("link")}
                type="button"
                onClick={removeLink}
              >
                Remove
              </button>
              <div className="flex gap-2">
                <button
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="fixed bottom-20 md:bottom-8 left-1/2 z-50 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full bg-white px-3 py-2 shadow-xl border border-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:shadow-black/40">
        {tools.map(({ label, icon: Icon, active, run }) => {
          const isActive = active();

          return (
            <button
              key={label}
              aria-label={label}
              aria-pressed={isActive ? "true" : "false"}
              className={`shrink-0 p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? "bg-gray-200/80 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
              }`}
              disabled={disabled}
              type="button"
              onClick={run}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </button>
          );
        })}

        <div className="mx-1 h-5 w-px shrink-0 bg-gray-200 dark:bg-gray-800" />

        <button
          aria-label="Add link"
          aria-pressed={editor?.isActive("link") ? "true" : "false"}
          className={`shrink-0 p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            editor?.isActive("link")
              ? "bg-gray-200/80 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
          }`}
          disabled={disabled}
          type="button"
          onClick={openLinkModal}
        >
          <Link size={18} strokeWidth={2} />
        </button>

        <button
          aria-label="Upload image"
          className="shrink-0 p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
          disabled={disabled || isUploadingImage}
          type="button"
          onClick={onInsertImage}
        >
          {isUploadingImage ? (
            <UploadCloud className="animate-pulse" size={18} strokeWidth={2} />
          ) : (
            <Image size={18} strokeWidth={2} />
          )}
        </button>
      </div>
    </>
  );
};

export default EditorToolbar;
