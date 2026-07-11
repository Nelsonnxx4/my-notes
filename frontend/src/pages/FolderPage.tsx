import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlusIcon, Loader2, Check, X } from "lucide-react";

import FolderCard from "@/components/folders/FolderCard";
import { useFolders, useCreateFolder } from "@/hooks/useFolder";

export const FOLDER_COLORS = [
  {
    bg: "bg-[#fc843e18]",
    text: "text-[#c45a1a]",
    border: "border-[#fc843e50]",
    icon: "text-[#fc843e]",
  },
  {
    bg: "bg-[#D7B0CB18]",
    text: "text-[#9b5c88]",
    border: "border-[#D7B0CB50]",
    icon: "text-[#c47fb0]",
  },
  {
    bg: "bg-[#926bf418]",
    text: "text-[#6b3fcf]",
    border: "border-[#926bf450]",
    icon: "text-[#926bf4]",
  },
  {
    bg: "bg-[#D1F5E0]",
    text: "text-[#2e8b57]",
    border: "border-[#D1F5E050]",
    icon: "text-[#5fcf8a]",
  },
  {
    bg: "bg-[#FFE4D6]",
    text: "text-[#c4601a]",
    border: "border-[#FFE4D650]",
    icon: "text-[#f0944d]",
  },
  {
    bg: "bg-[#f6ec3318]",
    text: "text-[#a08a00]",
    border: "border-[#f6ec3350]",
    icon: "text-[#d4c220]",
  },
  {
    bg: "bg-[#E03F4018]",
    text: "text-[#b52b2b]",
    border: "border-[#E03F4050]",
    icon: "text-[#e05c5c]",
  },
  {
    bg: "bg-[#bfdbfe]",
    text: "text-[#1e40af]",
    border: "border-[#93c5fd50]",
    icon: "text-[#3b82f6]",
  },
];

function hashIndex(str: string, len: number): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash) % len;
}

const FolderPage: React.FC = () => {
  const { data: folders = [], isLoading } = useFolders();
  const { mutate: createFolder, isPending: isCreating } = useCreateFolder();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleCreate = () => {
    const name = newName.trim();

    if (!name) return;
    createFolder(name, {
      onSuccess: () => {
        setNewName("");
        setIsAdding(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewName("");
    }
  };

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 pt-20 pb-28 md:pt-32">
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : (
        <section className="flex flex-wrap justify-start items-start gap-3">
          <AnimatePresence>
            {folders.map((folder, i) => {
              const colorScheme =
                FOLDER_COLORS[hashIndex(folder.id, FOLDER_COLORS.length)];

              return (
                <motion.div
                  key={folder.id}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  initial={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <FolderCard
                    colorScheme={colorScheme}
                    count={folder.noteCount}
                    title={folder.name}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3, delay: folders.length * 0.04 }}
          >
            {isAdding ? (
              <div className="flex flex-col justify-between gap-3 min-w-35 min-h-35 md:min-w-50 md:min-h-50 p-4 rounded-md border border-gray-300 bg-white shadow-sm">
                <FolderPlusIcon
                  className="text-gray-400"
                  size={40}
                  strokeWidth={1.2}
                />
                <div className="flex flex-col gap-2">
                  <input
                    ref={inputRef}
                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm outline-none focus:border-gray-400"
                    disabled={isCreating}
                    maxLength={100}
                    placeholder="Folder name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex gap-1.5">
                    <button
                      className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-600/85 disabled:opacity-50 transition"
                      disabled={!newName.trim() || isCreating}
                      type="button"
                      onClick={handleCreate}
                    >
                      {isCreating ? (
                        <Loader2 className="animate-spin" size={11} />
                      ) : (
                        <Check size={11} />
                      )}
                      Create
                    </button>
                    <button
                      className="rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 transition"
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setNewName("");
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                aria-label="New folder"
                className="flex flex-col justify-center items-center p-4 bg-gray-100 min-w-35 min-h-35 md:min-w-50 md:min-h-50 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
                type="button"
                onClick={() => setIsAdding(true)}
              >
                <FolderPlusIcon
                  className="text-gray-400"
                  size={50}
                  strokeWidth={1}
                />
                <span className="mt-2 text-xs text-gray-400">New folder</span>
              </button>
            )}
          </motion.div>

          {folders.length === 0 && !isAdding && (
            <p className="text-sm text-gray-400 mt-2">
              No folders yet. Click the card above to create one.
            </p>
          )}
        </section>
      )}
    </main>
  );
};

export default FolderPage;
