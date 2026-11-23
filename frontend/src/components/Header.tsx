import { useLocation } from "react-router-dom";
import { Select, SelectItem } from "@heroui/react";
import { ChevronDown, FilterIcon, Grid3x2Icon, Keyboard, LayoutGridIcon, SearchIcon, X } from "lucide-react";

import SyncStatus from "@/components/SyncStatus";
import { useAppearance } from "@/contexts/AppearanceContext";
import { useNoteFilters } from "@/contexts/NoteFiltersContext";
import { useTags } from "@/hooks/useTags";
import { openCommandPalette } from "@/lib/appEvents";

const routeLabels: Record<string, string> = {
  "/home": "Home",
  "/notes": "All notes",
  "/favorites": "Favourites",
  "/archive": "Archive",
  "/folders": "Folders",
  "/create": "New note",
  "/settings": "Settings",
};

const pinnedKey = "__pinned__";
const tagPrefix = "tag:";
type FilterItem = { key: string; label: string };

export default function Header() {
  const location = useLocation();
  const { search, setSearch, filters, setFilters } = useNoteFilters();
  const { gridLayout, setGridLayout } = useAppearance();
  const { data: tags = [] } = useTags();
  const pageLabel = routeLabels[location.pathname] ?? "Notes";
  const filterItems: FilterItem[] = [
    { key: pinnedKey, label: "Pinned" },
    ...tags.map((tag) => ({ key: `${tagPrefix}${tag.id}`, label: tag.name })),
  ];
  const selectedKeys = new Set<string>([
    ...(filters.pinned ? [pinnedKey] : []),
    ...(filters.tagId !== undefined ? [`${tagPrefix}${filters.tagId}`] : []),
  ]);
  const hasActiveFilters = Boolean(filters.pinned || filters.tagId !== undefined);

  function handleFilterChange(keys: "all" | Set<React.Key>) {
    if (keys === "all") return;
    const pinned = keys.has(pinnedKey);
    const tagKey = [...keys].find((key) => String(key).startsWith(tagPrefix));
    setFilters({
      pinned: pinned || undefined,
      tagId: tagKey ? Number(String(tagKey).replace(tagPrefix, "")) : undefined,
    });
  }

  const filter = (
    <Select
      aria-label="Filter notes"
      className="w-36"
      classNames={{
        trigger: `h-8 min-h-8 rounded-[var(--app-radius-control)] border px-2 shadow-none ${
          hasActiveFilters
            ? "border-[var(--app-text)] bg-[var(--app-active)]"
            : "border-[var(--app-control)] bg-white"
        }`,
        value: "text-xs text-[var(--app-muted)]",
        popoverContent: "rounded-[var(--app-radius-card)] border border-[var(--app-border)] shadow-sm",
      }}
      items={filterItems}
      placeholder="Filter"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      selectorIcon={<ChevronDown size={14} strokeWidth={1.6} />}
      startContent={<FilterIcon className="text-[var(--app-muted)]" size={14} strokeWidth={1.6} />}
      onSelectionChange={handleFilterChange}
    >
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--app-border)] bg-[var(--app-ground)] min-[1101px]:left-60">
      <div className="hidden h-14 items-center gap-3 px-6 min-[1101px]:flex">
        <span className="w-24 text-sm font-medium text-[var(--app-text)]">{pageLabel}</span>
        <div className="flex h-8 max-w-md flex-1 items-center rounded-[var(--app-radius-control)] border border-[var(--app-control)] bg-white px-2.5 focus-within:border-[var(--app-text)]">
          <SearchIcon className="shrink-0 text-[var(--app-muted)]" size={15} strokeWidth={1.6} />
          <input
            aria-label="Search notes"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[var(--app-faint)]"
            placeholder="Search notes"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button aria-label="Clear search" className="text-[var(--app-muted)]" type="button" onClick={() => setSearch("")}>
              <X size={14} strokeWidth={1.6} />
            </button>
          )}
        </div>
        {filter}
        <div className="flex h-8 items-center rounded-[var(--app-radius-control)] border border-[var(--app-control)] bg-white p-0.5">
          <button
            aria-label="Comfortable grid"
            aria-pressed={gridLayout === "comfortable"}
            className={`grid h-6 w-7 place-items-center rounded-[4px] ${gridLayout === "comfortable" ? "bg-[var(--app-active)] text-[var(--app-text)]" : "text-[var(--app-muted)]"}`}
            type="button"
            onClick={() => setGridLayout("comfortable")}
          >
            <LayoutGridIcon size={15} strokeWidth={1.6} />
          </button>
          <button
            aria-label="Compact grid"
            aria-pressed={gridLayout === "compact"}
            className={`grid h-6 w-7 place-items-center rounded-[4px] ${gridLayout === "compact" ? "bg-[var(--app-active)] text-[var(--app-text)]" : "text-[var(--app-muted)]"}`}
            type="button"
            onClick={() => setGridLayout("compact")}
          >
            <Grid3x2Icon size={15} strokeWidth={1.6} />
          </button>
        </div>
        <button
          className="ml-auto flex h-8 items-center gap-1.5 rounded-[var(--app-radius-control)] px-2 text-xs text-[var(--app-muted)] hover:bg-[var(--app-raised)]"
          type="button"
          onClick={openCommandPalette}
        >
          <Keyboard size={14} strokeWidth={1.6} />
          <span>Commands</span>
          <kbd className="rounded border border-[var(--app-control)] px-1 py-0.5 text-[11px]">⌘K</kbd>
        </button>
        <SyncStatus />
      </div>

      <div className="flex h-14 items-center gap-2 px-4 min-[1101px]:hidden">
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--app-text)]">{pageLabel}</span>
        <SyncStatus />
        <button
          aria-label="Open command palette"
          className="grid h-9 w-9 place-items-center rounded-[var(--app-radius-control)] border border-[var(--app-control)] bg-white text-[var(--app-muted)]"
          type="button"
          onClick={openCommandPalette}
        >
          <SearchIcon size={16} strokeWidth={1.6} />
        </button>
      </div>
    </header>
  );
}
