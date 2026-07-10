import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import NoteCard from "@/components/notes/NoteCard";
import FolderCard from "@/components/folders/FolderCard";
import { FOLDER_COLORS } from "@/pages/FolderPage";
import { useNotes } from "@/hooks/queries/useNotes";
import { useFolders } from "@/hooks/useFolder";
import { useAuth } from "@/contexts/AuthContext";
import { hashColor, hashIndex } from "@/utils/noteColors";
import { useAppearance } from "@/contexts/AppearanceContext";

const now = new Date();
const hour = now.getHours();
const greeting =
  hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

const SectionHeader: React.FC<{ label: string; to: string }> = ({
  label,
  to,
}) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-gray-700 font-semibold text-lg">{label}</h2>
    <Link
      className="flex items-center gap-1 text-green-500 text-sm font-medium hover:underline"
      to={to}
    >
      View all <ArrowRight size={13} strokeWidth={2} />
    </Link>
  </div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: notes = [], isLoading } = useNotes();
  const { data: folders = [] } = useFolders();

  const recentNotes = notes.slice(0, 6).map((note) => ({
    ...note,
    color: hashColor(note.title),
  }));

  const recentFolders = folders.slice(0, 4).map((folder) => ({
    ...folder,
    colorScheme: FOLDER_COLORS[hashIndex(folder.id, FOLDER_COLORS.length)],
  }));

  const { compactMode, gridLayout } = useAppearance();

  const gridCols =
    gridLayout === "compact"
      ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  const emailPrefix = user?.email?.split("@")[0] ?? "there";
  const displayName = localStorage.getItem("app:displayName") ?? emailPrefix;

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 pt-20 pb-28 md:pt-32">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
        initial={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-1">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-3xl font-bold text-gray-800">
          {greeting}, {displayName} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          You have{" "}
          <span className="text-green-500 font-semibold">
            {isLoading ? "…" : notes.length} notes
          </span>{" "}
          across{" "}
          <span className="text-green-500 font-semibold">
            {folders.length} folders
          </span>
          .
        </p>
      </motion.div>

      <SectionHeader label="Recent Folders" to="/folders" />
      <section className={`flex flex-wrap mb-10 ${compactMode ? "gap-1.5" : "gap-3"}`}>
        {recentFolders.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">No folders yet.</p>
        ) : (
          recentFolders.map((folder, i) => (
            <motion.div
              key={folder.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <FolderCard
                colorScheme={folder.colorScheme}
                count={folder.noteCount}
                title={folder.name}
              />
            </motion.div>
          ))
        )}
      </section>

      <SectionHeader label="Recent Notes" to="/notes" />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2
            className="animate-spin text-green-400"
            size={24}
            strokeWidth={1.5}
          />
        </div>
      ) : recentNotes.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">
          No notes yet.{" "}
          <button
            className="text-green-500 font-medium hover:underline"
            onClick={() => navigate("/create")}
          >
            Create one →
          </button>
        </p>
      ) : (
        <section className={`grid ${gridCols} ${compactMode ? "gap-1.5" : "gap-3"}`}>
          {recentNotes.map((note, i) => (
            <motion.div
              key={note.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <NoteCard
                noteId={note.id}
                color={note.color}
                content={note.content ?? ""}
                isFavorite={note.isFavorite}
                isPinned={note.isPinned}
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

export default HomePage;
