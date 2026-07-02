// frontend/src/pages/FavoritesPage.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Loader2 } from "lucide-react";

import NoteCard from "@/components/notes/NoteCard";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { hashColor } from "@/utils/noteColors";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: notes = [], isLoading } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-20 pb-28">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-5 w-5 text-green-600" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-800">Favourites</h1>
        </div>
        <p className="text-gray-500 text-sm">
          {notes.length} favourited note{notes.length !== 1 ? "s" : ""}
        </p>
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
          <Star className="text-gray-200 mb-4" size={48} strokeWidth={1} />
          <p className="text-gray-400 text-sm">No favourites yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Open any note and tap the star to add it here.
          </p>
        </div>
      ) : (
        <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <NoteCard
                color={hashColor(note.title)}
                content={note.content ?? ""}
                isFavorite={note.isFavorite}
                isPinned={note.isPinned}
                tags={note.tags}
                title={note.title}
                updatedAt={note.updatedAt}
                onClick={() => navigate(`/notes/${note.id}`)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  toggleFavorite({
                    noteId: note.id,
                    isFavorite: note.isFavorite,
                  });
                }}
              />
            </motion.div>
          ))}
        </section>
      )}
    </main>
  );
};

export default FavoritesPage;
