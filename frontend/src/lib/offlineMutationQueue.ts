import type { UpdateNotePayload } from "@/types";

const DATABASE_NAME = "notlify-offline";
const STORE_NAME = "pending-note-updates";
const QUEUE_CHANGED_EVENT = "notlify:offline-queue-changed";

const fallbackQueue = new Map<string, PendingNoteUpdate>();
const suppressedNoteIds = new Set<string>();

export interface PendingNoteUpdate {
  noteId: string;
  payload: UpdateNotePayload;
  updatedAt: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "noteId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function notifyQueueChanged() {
  window.dispatchEvent(new Event(QUEUE_CHANGED_EVENT));
}

async function runTransaction<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = action(transaction.objectStore(STORE_NAME));

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
  });
}

export async function queueNoteUpdate(
  noteId: string,
  payload: UpdateNotePayload,
): Promise<void> {
  let existing: PendingNoteUpdate | undefined;

  try {
    existing = await runTransaction<PendingNoteUpdate | undefined>(
      "readonly",
      (store) => store.get(noteId),
    );
  } catch {
    // IndexedDB can be unavailable in private contexts.
  }

  const queuedUpdate = {
    noteId,
    payload: {
      ...existing?.payload,
      ...fallbackQueue.get(noteId)?.payload,
      ...payload,
    },
    updatedAt: Date.now(),
  } satisfies PendingNoteUpdate;

  suppressedNoteIds.delete(noteId);
  try {
    await runTransaction("readwrite", (store) => store.put(queuedUpdate));
    fallbackQueue.delete(noteId);
  } catch {
    fallbackQueue.set(noteId, queuedUpdate);
  }
  notifyQueueChanged();
}

export async function getQueuedNoteUpdates(): Promise<PendingNoteUpdate[]> {
  let storedUpdates: PendingNoteUpdate[] = [];

  try {
    storedUpdates = await runTransaction<PendingNoteUpdate[]>("readonly", (store) =>
      store.getAll(),
    );
  } catch {
    // The in-memory fallback still protects the current editing session.
  }

  const updatesByNote = new Map(
    storedUpdates
      .filter((update) => !suppressedNoteIds.has(update.noteId))
      .map((update) => [update.noteId, update]),
  );
  for (const update of fallbackQueue.values()) {
    updatesByNote.set(update.noteId, update);
  }

  return [...updatesByNote.values()].sort((a, b) => a.updatedAt - b.updatedAt);
}

export async function removeQueuedNoteUpdate(noteId: string): Promise<void> {
  fallbackQueue.delete(noteId);
  try {
    await runTransaction("readwrite", (store) => store.delete(noteId));
    suppressedNoteIds.delete(noteId);
  } catch {
    // Prevent a successfully synced IndexedDB record from retrying this session.
    suppressedNoteIds.add(noteId);
  }
  notifyQueueChanged();
}

export function listenForQueuedNoteChanges(listener: () => void) {
  window.addEventListener(QUEUE_CHANGED_EVENT, listener);

  return () => window.removeEventListener(QUEUE_CHANGED_EVENT, listener);
}
