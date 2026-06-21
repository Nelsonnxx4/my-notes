import { Plus } from "lucide-react";

const FloatingButton = () => {
  return (
    <button
      aria-label="add"
      className="fixed bottom-28 left-1/2 z-40 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_25px_45px_rgba(15,23,42,0.25)]"
    >
      <Plus size={28} />
    </button>
  );
};

export default FloatingButton;
