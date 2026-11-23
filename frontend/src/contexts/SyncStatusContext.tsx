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
  listenForQueuedNoteChanges,
  removeQueuedNoteUpdate,
} from "@/lib/offlineMutationQueue";
import { broadcastNotesChanged, listenForNoteChanges } from "@/lib/noteEvents";

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
      await refreshPendingCount();
      return;
    }

    try {
      const queued = await getQueuedNoteUpdates();
      if (queued.length === 0) {
        setPendingCount(0);
        setState("saved");
        return;
      }

      setState("saving");
      for (const update of queued) {
        await updateNote(update.noteId, update.payload);
        await removeQueuedNoteUpdate(update.noteId);
        queryClient.invalidateQueries({ queryKey: ["note", update.noteId] });
      }
      await refreshPendingCount();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      broadcastNotesChanged();
      setState("saved");
    } catch {
      await refreshPendingCount();
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

  useEffect(
    () => listenForQueuedNoteChanges(() => void refreshPendingCount()),
    [refreshPendingCount],
  );

  const value = useMemo<SyncStatusContextValue>(
    () => ({
      state,
      pendingCount,
      flush,
      setSaving: () => setState("saving"),
      setSaved: () => {
        void refreshPendingCount();
        setState("saved");
      },
      setOffline: () => {
        void refreshPendingCount();
        setState("offline");
      },
      setError: () => {
        void refreshPendingCount();
        setState("error");
      },
    }),
    [flush, pendingCount, refreshPendingCount, state],
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
