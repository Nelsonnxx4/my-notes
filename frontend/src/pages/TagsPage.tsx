import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, X, Search } from "lucide-react";
import { Input } from "@heroui/react";

interface TagItem {
  id: string;
  name: string;
  color: string;
  count: number;
  isCustom?: boolean;
}

const TAG_COLORS = [
  {
    bg: "bg-green-200/85",
    text: "text-green-700",
    border: "border-green-300",
    dot: "bg-green-400",
  },
  {
    bg: "bg-blue-200/85",
    text: "text-blue-700",
    border: "border-blue-300",
    dot: "bg-blue-400",
  },
  {
    bg: "bg-purple-200/85",
    text: "text-purple-700",
    border: "border-purple-300",
    dot: "bg-purple-400",
  },
  {
    bg: "bg-orange-200/85",
    text: "text-orange-700",
    border: "border-orange-300",
    dot: "bg-orange-400",
  },
  {
    bg: "bg-pink-200/85",
    text: "text-pink-700",
    border: "border-pink-300",
    dot: "bg-pink-400",
  },
  {
    bg: "bg-yellow-200/85",
    text: "text-yellow-700",
    border: "border-yellow-300",
    dot: "bg-yellow-400",
  },
  {
    bg: "bg-teal-200/85",
    text: "text-teal-700",
    border: "border-teal-300",
    dot: "bg-teal-400",
  },
  {
    bg: "bg-red-200/85",
    text: "text-red-700",
    border: "border-red-300",
    dot: "bg-red-400",
  },
];

function randomColor() {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}

const INITIAL_TAGS: TagItem[] = [
  { id: "1", name: "Work", color: "0", count: 12 },
  { id: "2", name: "Personal", color: "1", count: 7 },
  { id: "3", name: "Ideas", color: "2", count: 5 },
  { id: "4", name: "Reading list", color: "3", count: 9 },
  { id: "5", name: "Projects", color: "4", count: 3 },
  { id: "6", name: "Learning", color: "5", count: 6 },
  { id: "7", name: "Recipes", color: "6", count: 2 },
  { id: "8", name: "Travel", color: "7", count: 4 },
];

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [search, setSearch] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  function addTag() {
    const name = newTagName.trim();

    if (!name) return;
    if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      inputRef.current?.setCustomValidity("Tag already exists");
      inputRef.current?.reportValidity();

      return;
    }
    const newTag: TagItem = {
      id: Date.now().toString(),
      name,
      color: String(selectedColorIdx),
      count: 0,
      isCustom: true,
    };

    setTags((prev) => [newTag, ...prev]);
    setNewTagName("");
    setShowInput(false);
    setSelectedColorIdx(0);
  }

  function deleteTag(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id));
    if (activeTag === id) setActiveTag(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addTag();
    if (e.key === "Escape") {
      setShowInput(false);
      setNewTagName("");
    }
  }

  const getColor = (colorStr: string) =>
    TAG_COLORS[Number(colorStr) % TAG_COLORS.length];

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-20">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-5 w-5 text-green-600" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-800">Tags</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Organise your notes with tags. Click a tag to filter notes by it.
        </p>
      </motion.div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            strokeWidth={1.5}
          />
          <Input
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent transition"
            placeholder="Search tags…"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-600/85 text-white text-sm font-medium transition hover:shadow-sm cursor-pointer"
          onClick={() => {
            setShowInput((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
        >
          <Plus size={15} strokeWidth={1.5} />
          New tag
        </button>
      </div>

      {/* New tag input panel */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden mb-6"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50">
              <input
                ref={inputRef}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition"
                maxLength={30}
                placeholder="Tag name…"
                type="text"
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  inputRef.current?.setCustomValidity("");
                }}
                onKeyDown={handleKeyDown}
              />

              {/* Color picker */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {TAG_COLORS.map((c, i) => (
                  <button
                    key={i}
                    aria-label="color button"
                    className={`h-6 w-6 rounded-full ${c.dot} transition-all ${
                      selectedColorIdx === i
                        ? "ring-2 ring-offset-1 ring-gray-500 scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedColorIdx(i)}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-medium transition"
                  disabled={!newTagName.trim()}
                  onClick={addTag}
                >
                  Add
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm transition"
                  onClick={() => {
                    setShowInput(false);
                    setNewTagName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags grid */}
      {filteredTags.length === 0 ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0 }}
        >
          <Tag className="h-10 w-10 text-gray-200 mb-3" strokeWidth={1} />
          <p className="text-gray-400 text-sm">
            {search
              ? `No tags matching "${search}"`
              : "No tags yet. Create your first one!"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          <AnimatePresence>
            {filteredTags.map((tag) => {
              const c = getColor(tag.color);
              const isActive = activeTag === tag.id;

              return (
                <motion.div
                  key={tag.id}
                  layout
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative group flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-all select-none ${c.bg} ${c.border} ${
                    isActive
                      ? "ring-2 ring-offset-1 ring-green-400 shadow-md"
                      : "hover:shadow-sm"
                  }`}
                  exit={{ opacity: 0, scale: 0.88 }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveTag(isActive ? null : tag.id)}
                >
                  {/* Delete button — custom tags only */}
                  {tag.isCustom && (
                    <button
                      aria-label="delete custom tag"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition h-5 w-5 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-gray-500 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTag(tag.id);
                      }}
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  )}

                  <div className={`h-2 w-2 rounded-full ${c.dot}`} />
                  <span
                    className={`text-sm font-semibold leading-tight ${c.text}`}
                  >
                    {tag.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {tag.count} {tag.count === 1 ? "note" : "notes"}
                  </span>

                  {tag.isCustom && (
                    <span className="text-[10px] text-gray-400 italic">
                      custom
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
};

export default TagsPage;
