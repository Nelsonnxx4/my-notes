import { Bold, Italic, List, CheckSquare, Image } from "lucide-react";

const EditorToolbar = () => {
  return (
    <div
      className="
      fixed
      bottom-24
      left-1/2
      z-50
      flex
      -translate-x-1/2
      gap-2
      rounded-full
      bg-white
      p-3
      shadow-xl
    "
    >
      <button aria-label="Bold" className="p-2" type="button">
        <Bold size={18} strokeWidth={2} />
      </button>

      <button aria-label="Italic" className="p-2" type="button">
        <Italic size={18} strokeWidth={2} />
      </button>

      <button aria-label="List" className="p-2" type="button">
        <List size={18} strokeWidth={2} />
      </button>

      <button aria-label="Checklist" className="p-2" type="button">
        <CheckSquare size={18} strokeWidth={2} />
      </button>

      <button aria-label="Image" className="p-2" type="button">
        <Image size={18} strokeWidth={2} />
      </button>
    </div>
  );
};

export default EditorToolbar;
