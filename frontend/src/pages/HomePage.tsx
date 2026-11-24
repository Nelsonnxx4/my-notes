import { ArrowRight, Loader2, PenLine, Plus } from "lucide-react";
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

  const recentNotes = notes.slice(0, 7).map((note) => ({
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
  const latestNote = recentNotes[0];
  const notePreview = latestNote?.content
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <main className="min-h-screen px-4 pb-28 pt-20 md:px-6 md:pb-12 md:pt-24 xl:px-10">
      <div className="ui-enter mb-8">
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

      <section className="ui-enter ui-enter-late mb-10 grid overflow-hidden rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] lg:grid-cols-[1.55fr_0.75fr]">
        {latestNote ? (
          <button
            className="group relative min-h-64 border-b border-[var(--app-border)] p-6 text-left hover:bg-[var(--app-raised)] lg:border-b-0 lg:border-r"
            type="button"
            onClick={() => navigate(`/notes/${latestNote.id}`)}
          >
            <span className="absolute inset-y-6 left-0 w-0.5 bg-[var(--app-focus)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--app-focus)]">
              Continue writing
            </span>
            <h2 className="mt-7 max-w-xl text-[clamp(1.65rem,4vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--app-text)]">
              {latestNote.title || "Untitled note"}
            </h2>
            <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-[var(--app-muted)]">
              {notePreview || "Open this note and continue the thought."}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
              Resume note <ArrowRight size={15} />
            </span>
          </button>
        ) : (
          <div className="relative flex min-h-64 flex-col justify-center border-b border-[var(--app-border)] p-6 lg:border-b-0 lg:border-r">
            <span className="absolute inset-y-6 left-0 w-0.5 bg-[var(--app-focus)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--app-focus)]">
              Your first line
            </span>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-[var(--app-text)]">
              Start with the thought you do not want to lose.
            </h2>
            <button
              className="mt-7 flex h-9 w-fit items-center gap-2 rounded-[var(--app-radius-control)] bg-[var(--app-primary)] px-4 text-sm font-medium text-[var(--app-ground)]"
              type="button"
              onClick={() => navigate("/create")}
            >
              <Plus size={15} /> Create a note
            </button>
          </div>
        )}

        <div className="flex flex-col justify-between p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--app-faint)]">
              Workspace ledger
            </p>
            <dl className="mt-6 divide-y divide-[var(--app-rule)]">
              <div className="flex items-baseline justify-between py-3">
                <dt className="text-sm text-[var(--app-muted)]">Notes</dt>
                <dd className="text-2xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">
                  {notes.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between py-3">
                <dt className="text-sm text-[var(--app-muted)]">Folders</dt>
                <dd className="text-2xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">
                  {folders.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between py-3">
                <dt className="text-sm text-[var(--app-muted)]">Favourites</dt>
                <dd className="text-2xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">
                  {notes.filter((note) => note.isFavorite).length}
                </dd>
              </div>
            </dl>
          </div>
          <button
            className="mt-6 flex h-9 w-full items-center justify-center gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-control)] text-sm font-medium text-[var(--app-text)] hover:bg-[var(--app-raised)]"
            type="button"
            onClick={() => navigate("/create")}
          >
            <PenLine size={15} /> New note
          </button>
        </div>
      </section>

      <SectionHeader label="Recent folders" to="/folders" />
      <section
        className={`flex flex-wrap mb-10 ${compactMode ? "gap-1.5" : "gap-3"}`}
      >
        {recentFolders.length === 0 ? (
          <p className="py-2 text-sm text-[var(--app-muted)]">
            No folders yet.
          </p>
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
          <h3 className="text-base font-semibold text-[var(--app-text)]">
            Start your first note
          </h3>
          <p className="mt-1 max-w-md text-sm text-[var(--app-muted)]">
            Capture an idea now. It will stay available here and sync when you
            are online.
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
        <section
          className={`grid ${gridCols} ${compactMode ? "gap-1.5" : "gap-3"}`}
        >
          {recentNotes.slice(latestNote ? 1 : 0).map((note) => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/notes/${note.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/notes/${note.id}`);
                }
              }}
            >
              <NoteCard
                color={note.color}
                content={note.content ?? ""}
                isFavorite={note.isFavorite}
                isPinned={note.isPinned}
                noteId={note.id}
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
