import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { updateNote } from "@/api/notes.api";
import {
  getQueuedNoteUpdates,
  removeQueuedNoteUpdate,
} from "@/lib/offlineMutationQueue";
import { listenForNoteChanges } from "@/lib/noteEvents";

export type SyncState = "saved" | "saving" | "offline" | "error";

interface SyncStatusContextValue {
  state: SyncState;
  pendingCount: number;
  flush: () => Promise<void>;
  setSaving: () => void;
  setSaved: () => void;
  setOffline: () => void;
  setError: () => void;
}

const SyncStatusContext = createContext<SyncStatusContextValue | null>(null);

export function SyncStatusProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SyncState>(() =>
    navigator.onLine ? "saved" : "offline",
  );
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    try {
      setPendingCount((await getQueuedNoteUpdates()).length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  const flush = useCallback(async () => {
    if (!navigator.onLine) {
      setState("offline");
      return;
    }

    const queued = await getQueuedNoteUpdates();
    if (queued.length === 0) {
      setState("saved");
      return;
    }

    setState("saving");
    try {
      for (const update of queued) {
        await updateNote(update.noteId, update.payload);
        await removeQueuedNoteUpdate(update.noteId);
      }
      await refreshPendingCount();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setState("saved");
    } catch {
      setState(navigator.onLine ? "error" : "offline");
    }
  }, [queryClient, refreshPendingCount]);

  useEffect(() => {
    void refreshPendingCount();
    void flush();
    const handleOnline = () => void flush();
    const handleOffline = () => setState("offline");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [flush, refreshPendingCount]);

  useEffect(
    () =>
      listenForNoteChanges(() => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      }),
    [queryClient],
  );

  const value = useMemo<SyncStatusContextValue>(
    () => ({
      state,
      pendingCount,
      flush,
      setSaving: () => setState("saving"),
      setSaved: () => setState("saved"),
      setOffline: () => setState("offline"),
      setError: () => setState("error"),
    }),
    [flush, pendingCount, state],
  );

  return <SyncStatusContext.Provider value={value}>{children}</SyncStatusContext.Provider>;
}

export function useSyncStatus() {
  const context = useContext(SyncStatusContext);
  if (!context) {
    throw new Error("useSyncStatus must be used within SyncStatusProvider");
  }
  return context;
}
