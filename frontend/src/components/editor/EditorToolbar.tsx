import { useState, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Image } from "lucide-react";

interface EditorToolbarProps {
  execFormat: (command: string, value?: string) => void;
  onInsertImage: () => void;
}

const tools = [
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Bullet list", icon: List, command: "insertUnorderedList" },
  { label: "Numbered list", icon: ListOrdered, command: "insertOrderedList" },
] as const;

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  execFormat,
  onInsertImage,
}) => {
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updateActiveState = () => {
      const active = new Set<string>();

      for (const { command } of tools) {
        try {
          if (document.queryCommandState(command)) active.add(command);
        } catch {
          // ignore unsupported commands
        }
      }

      setActiveCommands(active);
    };

    document.addEventListener("selectionchange", updateActiveState);
    return () =>
      document.removeEventListener("selectionchange", updateActiveState);
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-3 py-2 shadow-xl border border-gray-100">
      {tools.map(({ label, icon: Icon, command }) => {
        const isActive = activeCommands.has(command);

        return (
          <button
            key={command}
            aria-label={label}
            aria-pressed={isActive ? "true" : "false"}
            className={`p-2 rounded-full transition-colors ${
              isActive
                ? "bg-gray-200/20 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            type="button"
            onClick={() => execFormat(command)}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button
        aria-label="Insert image"
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        type="button"
        onClick={onInsertImage}
      >
        <Image size={18} strokeWidth={2} />
      </button>
    </div>
  );
};

export default EditorToolbar;
