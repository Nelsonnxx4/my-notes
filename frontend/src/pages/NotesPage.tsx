import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, NotebookText } from "lucide-react";

import NoteCard from "@/components/notes/NoteCard";
import { useNotes } from "@/hooks/queries/useNotes";
import { hashColor } from "@/utils/noteColors";
import { useAppearance } from "@/contexts/AppearanceContext";
import { useNoteFilters } from "@/contexts/NoteFiltersContext";

const GRID_COLS = {
  comfortable: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  compact: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
};

const NotesPage = () => {
  const navigate = useNavigate();
  const { search, filters } = useNoteFilters();
  const { data: allNotes = [], isLoading } = useNotes(
    search ? { q: search } : filters.tagId ? { tag: filters.tagId } : undefined,
  );
  const { compactMode, gridLayout } = useAppearance();

  const notes = filters.pinned ? allNotes.filter((n) => n.isPinned) : allNotes;

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 pt-20 pb-28 md:pt-32">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Notes</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-600/85 transition shadow-sm cursor-pointer"
          type="button"
          onClick={() => navigate("/create")}
        >
          <Plus size={15} strokeWidth={2} />
          New note
        </button>
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
            {search
              ? `No notes match "${search}"`
              : filters.pinned
                ? "No pinned notes"
                : "No notes yet"}
          </p>
          {!search && !filters.pinned && (
            <button
              className="mt-4 text-green-600 text-sm font-medium hover:underline"
              type="button"
              onClick={() => navigate("/create")}
            >
              Create your first note →
            </button>
          )}
        </div>
      )}

      {!isLoading && notes.length > 0 && (
        <section
          className={`grid ${GRID_COLS[gridLayout]} ${compactMode ? "gap-1.5" : "gap-3"}`}
        >
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <NoteCard
                noteId={note.id}
                color={hashColor(note.title)}
                content={note.content ?? ""}
                isPinned={note.isPinned}
                isFavorite={note.isFavorite}
                tags={note.tags}
                title={note.title}
                updatedAt={note.updatedAt}
                onEdit={() => navigate(`/notes/${note.id}`)}
              />
            </motion.div>
          ))}
        </section>
      )}
    </main>
  );
};

export default NotesPage;
