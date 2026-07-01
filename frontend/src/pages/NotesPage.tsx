import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Loader2, NotebookText } from "lucide-react";

import NoteCard from "@/components/notes/NoteCard";
import { useNotes } from "@/hooks/queries/useNotes";

const NOTE_COLORS = [
  "bg-[#fc843e96]",
  "bg-[#D7B0CB96]",
  "bg-[#34d39996]",
  "bg-[#D1F5E096]",
  "bg-[#FFE4D696]",
  "bg-[#f6ec3396]",
  "bg-[#926bf496]",
  "bg-[#E03F4096]",
];

const hashColor = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return NOTE_COLORS[Math.abs(hash) % NOTE_COLORS.length];
};

const NotesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: notes = [], isLoading } = useNotes(
    search ? { q: search } : undefined,
  );

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-20 pb-28">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Notes</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-600/85 transition shadow-sm cursor-pointer"
          onClick={() => navigate("/create")}
        >
          <Plus size={15} strokeWidth={2} />
          New note
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
          strokeWidth={1.5}
        />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          placeholder="Search notes…"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-24">
          <Loader2
            className="animate-spin text-green-400"
            size={28}
            strokeWidth={1.5}
          />
        </div>
      )}

      {!isLoading && notes.length === 0 && (
        <div className="flex flex-col items-center py-24 text-center">
          <NotebookText
            className="text-gray-200 mb-4"
            size={48}
            strokeWidth={1}
          />
          <p className="text-gray-500 font-medium">
            {search ? `No notes match "${search}"` : "No notes yet"}
          </p>
          {!search && (
            <button
              className="mt-4 text-green-600 text-sm font-medium hover:underline"
              onClick={() => navigate("/create")}
            >
              Create your first note →
            </button>
          )}
        </div>
      )}

      {!isLoading && notes.length > 0 && (
        <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <NoteCard
                color={hashColor(note.title)}
                content={note.content ?? ""}
                isPinned={note.isPinned}
                tags={note.tags}
                title={note.title}
                updatedAt={note.updatedAt}
              />
            </motion.div>
          ))}
        </section>
      )}
    </main>
  );
};

export default NotesPage;
