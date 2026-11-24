import { useEffect, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  MoreHorizontalIcon,
  Pencil,
  Pin,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  useDeleteNote,
  useArchiveNote,
  useUnarchiveNote,
} from "@/hooks/mutations/useNoteActions";
import { useToggleFavorite } from "@/hooks/useFavorites";
import { Tag } from "@/types";

interface NoteCardProps {
  noteId: string;
  title: string;
  content: string;
  color: string;
  tags?: Tag[];
  isPinned?: boolean;
  isFavorite: boolean;
  isArchived?: boolean;
  updatedAt?: string;
  onEdit: () => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);

  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);

  if (h < 24) return `${h}h ago`;

  return `${Math.floor(h / 24)}d ago`;
}

const NoteCard: React.FC<NoteCardProps> = ({
  noteId,
  title,
  content,
  color,
  tags,
  isPinned,
  isFavorite,
  isArchived = false,
  updatedAt,
  onEdit,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: archiveNote } = useArchiveNote();
  const { mutate: unarchiveNote } = useUnarchiveNote();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <article
      className="group relative flex h-72 min-w-60 cursor-default flex-col overflow-hidden rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 hover:border-[var(--app-control)]"
      data-note-tone={color}
    >
      <span className="absolute inset-y-0 left-0 w-0.5 bg-transparent group-hover:bg-[var(--app-focus)]" />
      <div className="mb-7 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--app-faint)]">
          {tags && tags.length > 0 ? `#${tags[0].name}` : "Note"}
        </p>

        <div
          ref={menuRef}
          className="relative flex items-center gap-1 text-[var(--app-muted)]"
        >
          {isPinned && <Pin size={14} strokeWidth={1.5} />}
          {isFavorite && (
            <Star
              className="text-[var(--app-focus)]"
              size={14}
              strokeWidth={1.5}
            />
          )}

          <button
            aria-label="Note options"
            className="rounded-[var(--app-radius-control)] p-1 hover:bg-[var(--app-raised)]"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            <MoreHorizontalIcon size={18} strokeWidth={1.5} />
          </button>

          {menuOpen && (
            <div className="ui-enter absolute right-0 top-8 z-30 min-w-36 rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)] py-1 shadow-lg">
              <button
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--app-raised)]"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit();
                }}
              >
                <Pencil size={14} strokeWidth={1.5} />
                Edit
              </button>

              <button
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--app-raised)]"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  toggleFavorite({ noteId, isFavorite });
                }}
              >
                {isFavorite ? (
                  <>
                    <StarOff size={14} strokeWidth={1.5} />
                    Unfavorite
                  </>
                ) : (
                  <>
                    <Star size={14} strokeWidth={1.5} />
                    Favorite
                  </>
                )}
              </button>

              <button
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--app-raised)]"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  isArchived ? unarchiveNote(noteId) : archiveNote(noteId);
                }}
              >
                {isArchived ? (
                  <>
                    <ArchiveRestore size={14} strokeWidth={1.5} />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive size={14} strokeWidth={1.5} />
                    Archive
                  </>
                )}
              </button>

              <div className="my-1 border-t border-[var(--app-rule)]" />

              <button
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--app-negative)] hover:bg-[var(--app-danger-soft)]"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  deleteNote(noteId);
                }}
              >
                <Trash2 size={14} strokeWidth={1.5} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold tracking-[-0.02em] text-[var(--app-text)]">
          {title}
        </h3>
        <p className="line-clamp-5 text-sm leading-6 text-[var(--app-muted)]">
          {plainText || "No preview yet."}
        </p>
        <div className="absolute inset-x-0 bottom-0 mt-5 flex items-baseline justify-between border-t border-[var(--app-rule)] pt-3 text-xs text-[var(--app-faint)]">
          <span>{updatedAt ? timeAgo(updatedAt) : ""}</span>
          <span>Updated</span>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
