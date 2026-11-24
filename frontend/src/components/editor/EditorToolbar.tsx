import type { Editor } from "@tiptap/react";

import {
  Bold,
  CheckSquare,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

import Tooltip from "@/components/Tooltip";

interface EditorToolbarProps {
  editor: Editor | null;
}

interface Tool {
  label: string;
  icon: React.ElementType;
  active: (editor: Editor) => boolean;
  execute: (editor: Editor) => void;
}

const tools: Tool[] = [
  {
    label: "Bold",
    icon: Bold,
    active: (editor) => editor.isActive("bold"),
    execute: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Italic",
    icon: Italic,
    active: (editor) => editor.isActive("italic"),
    execute: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "Bullet list",
    icon: List,
    active: (editor) => editor.isActive("bulletList"),
    execute: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered list",
    icon: ListOrdered,
    active: (editor) => editor.isActive("orderedList"),
    execute: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Checklist",
    icon: CheckSquare,
    active: (editor) => editor.isActive("taskList"),
    execute: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    label: "Quote",
    icon: Quote,
    active: (editor) => editor.isActive("blockquote"),
    execute: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
];

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Paste a secure link", previousUrl ?? "https://");

    if (url === null) return;
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImage = () => {
    const url = window.prompt("Paste an image URL (https only)", "https://");

    if (!url || !/^https:\/\//i.test(url)) return;
    editor.chain().focus().setImage({ src: url, alt: "" }).run();
  };

  return (
    <div
      aria-label="Formatting controls"
      className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-[var(--app-radius-card)] border border-[var(--app-control)] bg-[var(--app-surface)] p-1.5 min-[1101px]:bottom-6"
      role="toolbar"
    >
      {tools.map(({ label, icon: Icon, active, execute }) => {
        const isActive = active(editor);

        return (
          <Tooltip key={label} label={label}>
            <button
              aria-label={label}
              aria-pressed={isActive}
              className={`grid h-8 w-8 place-items-center rounded-[var(--app-radius-control)] transition-colors ${
                isActive
                  ? "bg-[var(--app-active)] text-[var(--app-text)]"
                  : "text-[var(--app-muted)] hover:bg-[var(--app-raised)] hover:text-[var(--app-text)]"
              }`}
              type="button"
              onClick={() => execute(editor)}
              onMouseDown={(event) => event.preventDefault()}
            >
              <Icon size={16} strokeWidth={1.7} />
            </button>
          </Tooltip>
        );
      })}
      <span
        aria-hidden="true"
        className="mx-1 h-5 w-px bg-[var(--app-border)]"
      />
      <Tooltip label="Add link">
        <button
          aria-label="Add link"
          className="grid h-8 w-8 place-items-center rounded-[var(--app-radius-control)] text-[var(--app-muted)] transition-colors hover:bg-[var(--app-raised)] hover:text-[var(--app-text)]"
          type="button"
          onClick={setLink}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Link size={16} strokeWidth={1.7} />
        </button>
      </Tooltip>
      <Tooltip label="Insert image">
        <button
          aria-label="Insert image from URL"
          className="grid h-8 w-8 place-items-center rounded-[var(--app-radius-control)] text-[var(--app-muted)] transition-colors hover:bg-[var(--app-raised)] hover:text-[var(--app-text)]"
          type="button"
          onClick={insertImage}
          onMouseDown={(event) => event.preventDefault()}
        >
          <ImagePlus size={16} strokeWidth={1.7} />
        </button>
      </Tooltip>
    </div>
  );
};

export default EditorToolbar;
