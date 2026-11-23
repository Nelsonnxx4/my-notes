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
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-base font-semibold text-[var(--app-text)]">{label}</h2>
    <Link
      className="flex items-center gap-1 text-sm font-medium text-[var(--app-muted)] hover:text-[var(--app-text)]"
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
    <main className="min-h-screen px-4 pb-28 pt-20 md:px-6 md:pb-12 md:pt-24 xl:px-10">
      <div className="mb-10">
        <p className="mb-1 text-sm text-[var(--app-muted)]">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--app-text)]">
          {greeting}, {displayName}
        </h1>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          You have{" "}
          <span className="font-medium text-[var(--app-text)]">
            {isLoading ? "…" : notes.length} notes
          </span>{" "}
          across{" "}
          <span className="font-medium text-[var(--app-text)]">
            {folders.length} folders
          </span>
          .
        </p>
      </div>

      <SectionHeader label="Recent folders" to="/folders" />
      <section className={`flex flex-wrap mb-10 ${compactMode ? "gap-1.5" : "gap-3"}`}>
        {recentFolders.length === 0 ? (
          <p className="py-2 text-sm text-[var(--app-muted)]">No folders yet.</p>
        ) : (
          recentFolders.map((folder) => (
            <div key={folder.id}>
              <FolderCard
                colorScheme={folder.colorScheme}
                count={folder.noteCount}
                title={folder.name}
              />
            </div>
          ))
        )}
      </section>

      <SectionHeader label="Recent notes" to="/notes" />

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)]">
          <Loader2
            className="animate-spin text-[var(--app-muted)]"
            size={24}
            strokeWidth={1.5}
          />
        </div>
      ) : recentNotes.length === 0 ? (
        <div className="flex min-h-44 flex-col items-start justify-center rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h3 className="text-base font-semibold text-[var(--app-text)]">Start your first note</h3>
          <p className="mt-1 max-w-md text-sm text-[var(--app-muted)]">
            Capture an idea now. It will stay available here and sync when you are online.
          </p>
          <button
            className="mt-5 h-9 rounded-[var(--app-radius-control)] bg-[var(--app-primary)] px-4 text-sm font-medium text-white hover:opacity-90"
            type="button"
            onClick={() => navigate("/create")}
          >
            Create a note
          </button>
        </div>
      ) : (
        <section className={`grid ${gridCols} ${compactMode ? "gap-1.5" : "gap-3"}`}>
          {recentNotes.map((note) => (
            <div
              key={note.id}
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
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default HomePage;
