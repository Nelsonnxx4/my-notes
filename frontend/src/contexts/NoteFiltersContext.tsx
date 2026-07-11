import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface NoteFilters {
  tagId?: number;
  pinned?: boolean;
}

interface NoteFiltersContextValue {
  search: string;
  setSearch: (s: string) => void;
  filters: NoteFilters;
  setFilters: (f: NoteFilters) => void;
  clearFilters: () => void;
}

const NoteFiltersContext = createContext<NoteFiltersContextValue | null>(null);

export function NoteFiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState("");
  const [filters, setFiltersState] = useState<NoteFilters>({});

  const setSearch = useCallback((s: string) => setSearchState(s), []);
  const setFilters = useCallback((f: NoteFilters) => setFiltersState(f), []);
  const clearFilters = useCallback(() => {
    setSearchState("");
    setFiltersState({});
  }, []);

  return (
    <NoteFiltersContext.Provider
      value={{ search, setSearch, filters, setFilters, clearFilters }}
    >
      {children}
    </NoteFiltersContext.Provider>
  );
}

export function useNoteFilters() {
  const ctx = useContext(NoteFiltersContext);
  if (!ctx)
    throw new Error("useNoteFilters must be used within NoteFiltersProvider");
  return ctx;
}
