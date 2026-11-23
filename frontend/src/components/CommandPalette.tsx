import { useEffect, useMemo, useRef, useState } from "react";
import { FilePlus2, FolderKanban, Keyboard, ListFilter, Settings, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useNotes } from "@/hooks/queries/useNotes";
import { useSyncStatus } from "@/contexts/SyncStatusContext";
import { listenForCommandPaletteOpen } from "@/lib/appEvents";
import { sanitizeNoteHtml } from "@/lib/sanitizeHtml";

interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  run: () => void;
}

function noteText(html: string | null) {
  const node = document.createElement("div");
  node.innerHTML = sanitizeNoteHtml(html ?? "");
  return node.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const { data: notes = [] } = useNotes();
  const { flush, state, pendingCount } = useSyncStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<PaletteItem[]>(
    () => [
      {
        id: "new-note",
        label: "Create a note",
        hint: "N",
        icon: FilePlus2,
        run: () => navigate("/create"),
      },
      {
        id: "all-notes",
        label: "Open all notes",
        icon: ListFilter,
        run: () => navigate("/notes"),
      },
      {
        id: "folders",
        label: "Organize folders",
        icon: FolderKanban,
        run: () => navigate("/folders"),
      },
      {
        id: "settings",
        label: "Open settings",
        icon: Settings,
        run: () => navigate("/settings"),
      },
      {
        id: "sync",
        label: pendingCount ? `Sync ${pendingCount} queued change${pendingCount === 1 ? "" : "s"}` : "Sync now",
        hint: state === "offline" ? "Offline" : undefined,
        icon: Wifi,
        run: () => void flush(),
      },
    ],
    [flush, navigate, pendingCount, state],
  );

  const items = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchingCommands = commands.filter((command) =>
      command.label.toLowerCase().includes(normalizedQuery),
    );
    const matchingNotes = notes
      .filter((note) => {
        if (!normalizedQuery) return false;
        return `${note.title} ${noteText(note.content)}`.toLowerCase().includes(normalizedQuery);
      })
      .slice(0, 6)
      .map<PaletteItem>((note) => ({
        id: `note-${note.id}`,
        label: note.title || "Untitled note",
        hint: noteText(note.content).slice(0, 58),
        icon: Keyboard,
        run: () => navigate(`/notes/${note.id}`),
      }));

    return [...matchingCommands, ...matchingNotes];
  }, [commands, navigate, notes, query]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const stopListening = listenForCommandPaletteOpen(() => setIsOpen(true));
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        navigate("/create");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      stopListening();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex(0);
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  const select = (item: PaletteItem) => {
    item.run();
    close();
  };

  return (
    <div
      aria-label="Command palette"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 px-4 pt-[12vh]"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-[var(--app-radius-card)] border border-[var(--app-border)] bg-[var(--app-surface)]">
        <label className="sr-only" htmlFor="command-search">
          Search commands and notes
        </label>
        <input
          ref={inputRef}
          id="command-search"
          className="h-12 w-full border-b border-[var(--app-border)] bg-transparent px-4 text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-faint)]"
          placeholder="Search notes or run a command"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, Math.max(items.length - 1, 0)));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Enter" && items[activeIndex]) {
              event.preventDefault();
              select(items[activeIndex]);
            }
          }}
        />
        <div className="max-h-[52vh] overflow-y-auto p-2" role="listbox">
          {items.length ? (
            items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  aria-selected={activeIndex === index}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-[var(--app-radius-control)] px-3 py-2 text-left ${
                    activeIndex === index ? "bg-[var(--app-active)]" : "hover:bg-[var(--app-raised)]"
                  }`}
                  role="option"
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(item)}
                >
                  <Icon className="shrink-0 text-[var(--app-muted)]" size={16} strokeWidth={1.6} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[var(--app-text)]">{item.label}</span>
                    {item.hint && <span className="block truncate text-xs text-[var(--app-muted)]">{item.hint}</span>}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-6 text-sm text-[var(--app-muted)]">No matching notes or commands.</p>
          )}
        </div>
        <div className="flex h-9 items-center gap-4 border-t border-[var(--app-rule)] px-4 text-xs text-[var(--app-faint)]">
          <span>↑ ↓ to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
