import { useEffect, useRef, useState } from "react";
import { Archive, ArchiveRestore, MoreHorizontalIcon, Pencil, Pin, Star, StarOff, Trash2 } from "lucide-react";

import { useDeleteNote, useArchiveNote, useUnarchiveNote } from "@/hooks/mutations/useNoteActions";
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
      className={`min-w-60 h-90 overflow-hidden rounded-2xl border border-gray-300 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${color}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
          {tags && tags.length > 0 ? `#${tags[0].name}` : "Note"}
        </h3>

        <div ref={menuRef} className="relative flex items-center gap-1 text-gray-700">
          {isPinned && (
            <Pin className="text-slate-600" size={14} strokeWidth={1.5} />
          )}
          {isFavorite && (
            <Star className="text-yellow-500" size={14} strokeWidth={1.5} />
          )}

          <button
            aria-label="Note options"
            className="rounded-full p-1 hover:bg-black/10 transition"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            <MoreHorizontalIcon size={18} strokeWidth={1.5} />
          </button>

          {menuOpen && (
            <div className="absolute top-8 right-0 z-30 min-w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <button
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
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
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
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
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
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

              <div className="my-1 border-t border-gray-100" />

              <button
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
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

      <div className="relative flex flex-col bg-white rounded-2xl p-4 h-[88%]">
        <h3 className="mb-3 text-lg font-semibold text-slate-900 line-clamp-2">
          {title}
        </h3>
        <p className="line-clamp-5 text-sm leading-6 text-slate-700">
          {content}
        </p>
        <div className="mt-5 absolute bottom-2 flex items-baseline justify-between w-[calc(100%-2rem)] text-xs text-slate-600">
          <span>{updatedAt ? timeAgo(updatedAt) : ""}</span>
          <span className="rounded-full bg-white/80 px-3 py-1">Updated</span>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
