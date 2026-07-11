import { useLocation } from "react-router-dom";
import { Select, SelectItem } from "@heroui/react";
import {
  SearchIcon,
  LayoutGridIcon,
  FilterIcon,
  ChevronDown,
  Grid3x2Icon,
  X,
} from "lucide-react";

import { useNoteFilters } from "@/contexts/NoteFiltersContext";
import { useAppearance } from "@/contexts/AppearanceContext";
import { useTags } from "@/hooks/useTags";

const ROUTE_LABELS: Record<string, string> = {
  "/home": "Home",
  "/notes": "All Notes",
  "/favorites": "Favourites",
  "/archive": "Archive",
  "/folders": "Folders",
  "/create": "New Note",
  "/settings": "Settings",
};

const PINNED_KEY = "__pinned__";
const TAG_PREFIX = "tag:";

type FilterItem = { key: string; label: string };

const PINNED_ITEM: FilterItem = { key: PINNED_KEY, label: "Pinned" };

const triggerBase =
  "bg-gray-100 border border-gray-200 rounded-lg px-3 h-9 shadow-none data-[hover=true]:border-gray-400 data-[open=true]:bg-white data-[open=true]:border-gray-400";

export default function Header() {
  const location = useLocation();
  const { search, setSearch, filters, setFilters } = useNoteFilters();
  const { gridLayout, setGridLayout } = useAppearance();
  const { data: tags = [] } = useTags();

  const pageLabel = ROUTE_LABELS[location.pathname] ?? "Notes";

  const filterItems: FilterItem[] = [
    PINNED_ITEM,
    ...tags.map((t) => ({ key: `${TAG_PREFIX}${t.id}`, label: t.name })),
  ];

  const selectedKeys = new Set<string>([
    ...(filters.pinned ? [PINNED_KEY] : []),
    ...(filters.tagId !== undefined ? [`${TAG_PREFIX}${filters.tagId}`] : []),
  ]);

  function handleFilterChange(keys: "all" | Set<React.Key>) {
    if (keys === "all") return;
    const pinned = keys.has(PINNED_KEY);
    const tagKey = [...keys].find((k) => String(k).startsWith(TAG_PREFIX));
    const tagId = tagKey
      ? Number(String(tagKey).replace(TAG_PREFIX, ""))
      : undefined;
    setFilters({ pinned: pinned || undefined, tagId });
  }

  const hasActiveFilters = !!filters.pinned || filters.tagId !== undefined;

  const activeTrigger = hasActiveFilters ? "border-green-400 bg-green-50" : "";

  const filterIcon = (
    <FilterIcon
      className={hasActiveFilters ? "text-green-500" : "text-gray-400"}
      size={14}
      strokeWidth={1.5}
    />
  );

  return (
    <header className="fixed top-0 left-0 right-0 md:left-50 lg:left-50 xl:left-65 z-50 bg-white border-b border-gray-200 w-full md:w-[74%] lg:w-[81%] xl:w-[83%]">
      {/* Desktop: two-row header */}
      <div className="hidden md:flex flex-col px-4 lg:px-10 py-4 gap-3 h-26.5">
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <span>Not-lify</span>
          <span>/</span>
          <span className="font-medium text-gray-700">{pageLabel}</span>
        </div>

        <div className="flex justify-between items-center gap-3">
          {/* Search */}
          <div className="flex items-center bg-gray-100 flex-1 max-w-sm h-9 px-3 rounded-lg border border-gray-200 transition-all focus-within:bg-white focus-within:border-gray-400 focus-within:shadow-sm">
            <SearchIcon
              className="text-gray-400 shrink-0"
              size={16}
              strokeWidth={1.5}
            />
            <input
              className="bg-transparent ml-2 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
              placeholder="Search notes…"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="text-gray-400 hover:text-gray-600 ml-1"
                type="button"
                onClick={() => setSearch("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter dropdown */}
            <Select
              className="w-44"
              classNames={{
                trigger: `${triggerBase} ${activeTrigger}`,
                value: "text-sm text-gray-500",
                popoverContent: "rounded-xl border border-gray-200 shadow-lg",
                listbox: "py-1",
              }}
              items={filterItems}
              placeholder="Filter"
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              selectorIcon={<ChevronDown size={14} strokeWidth={1.5} />}
              startContent={filterIcon}
              onSelectionChange={handleFilterChange}
            >
              {(item) => (
                <SelectItem key={item.key} textValue={item.label}>
                  {item.label}
                </SelectItem>
              )}
            </Select>

            {/* Grid layout toggle — tablet+ only */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 gap-0.5">
              <button
                aria-label="Comfortable grid"
                className={`p-1.5 rounded-md transition-all ${
                  gridLayout === "comfortable"
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                type="button"
                onClick={() => setGridLayout("comfortable")}
              >
                <LayoutGridIcon size={16} strokeWidth={1.5} />
              </button>
              <button
                aria-label="Compact grid"
                className={`p-1.5 rounded-md transition-all ${
                  gridLayout === "compact"
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                type="button"
                onClick={() => setGridLayout("compact")}
              >
                <Grid3x2Icon size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: single-row compact header */}
      <div className="flex md:hidden items-center gap-2 px-4 py-3 h-14">
        <div className="flex items-center bg-gray-100 flex-1 h-9 px-3 rounded-lg border border-gray-200 transition-all focus-within:bg-white focus-within:border-gray-400">
          <SearchIcon
            className="text-gray-400 shrink-0"
            size={15}
            strokeWidth={1.5}
          />
          <input
            className="bg-transparent ml-2 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
            placeholder="Search notes…"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="text-gray-400 hover:text-gray-600 ml-1"
              type="button"
              onClick={() => setSearch("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mobile filter — icon-only trigger */}
        <Select
          className="w-12 shrink-0"
          classNames={{
            trigger: `bg-gray-100 border rounded-lg px-2 h-9 min-w-0 shadow-none data-[hover=true]:border-gray-400 ${
              hasActiveFilters
                ? "border-green-400 bg-green-50"
                : "border-gray-200"
            }`,
            value: "hidden",
            selectorIcon: "hidden",
            popoverContent: "rounded-xl border border-gray-200 shadow-lg",
          }}
          items={filterItems}
          placeholder=""
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          startContent={
            <FilterIcon
              className={hasActiveFilters ? "text-green-500" : "text-gray-400"}
              size={16}
              strokeWidth={1.5}
            />
          }
          onSelectionChange={handleFilterChange}
        >
          {(item) => (
            <SelectItem key={item.key} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </Select>
      </div>
    </header>
  );
}
