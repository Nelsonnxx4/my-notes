import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import NoteCard from "@/components/notes/NoteCard";
import FolderCard from "@/components/folders/FolderCard";
import { folders } from "@/constant/folderConstants";
import { FOLDER_COLORS } from "@/pages/FolderPage";
import { useNotes } from "@/hooks/queries/useNotes";
import { useAuth } from "@/contexts/AuthContext";

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

const hashIndex = (str: string, len: number): number => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash) % len;
};

const recentFolders = folders.slice(0, 4).map((folder) => ({
  ...folder,
  colorScheme: FOLDER_COLORS[hashIndex(folder.title, FOLDER_COLORS.length)],
}));

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

  const recentNotes = notes.slice(0, 6).map((note) => ({
    ...note,
    color: NOTE_COLORS[hashIndex(note.title, NOTE_COLORS.length)],
  }));

  const displayName = user?.email?.split("@")[0] ?? "there";

  return (
    <main className="min-h-screen px-4 md:px-6 xl:px-10 py-20 pb-28">
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
      <section className="flex flex-wrap gap-3 mb-10">
        {recentFolders.map((folder, i) => (
          <motion.div
            key={folder.title}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <FolderCard
              count={2}
              {...folder}
              colorScheme={folder.colorScheme}
            />
          </motion.div>
        ))}
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
        <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          {recentNotes.map((note, i) => (
            <motion.div
              key={note.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <NoteCard
                color={note.color}
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

export default HomePage;
