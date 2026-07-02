import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Archive, Loader2 } from "lucide-react";

import NoteCard from "@/components/notes/NoteCard";
import { useArchivedNotes } from "@/hooks/queries/useNotes";
import { hashColor } from "@/utils/noteColors";

const ArchivePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useArchivedNotes();

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-20 pb-28">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Archive className="h-5 w-5 text-green-600" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-800">Archive</h1>
        </div>
        <p className="text-gray-500 text-sm">Notes you&apos;ve archived.</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2
            className="animate-spin text-green-400"
            size={28}
            strokeWidth={1.5}
          />
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Archive className="text-gray-200 mb-4" size={48} strokeWidth={1} />
          <p className="text-gray-400 text-sm">No archived notes.</p>
        </div>
      ) : (
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

export default ArchivePage;
