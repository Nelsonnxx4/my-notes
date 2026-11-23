import type { UpdateNotePayload } from "@/types";

const DATABASE_NAME = "notlify-offline";
const STORE_NAME = "pending-note-updates";

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
    // IndexedDB can be unavailable in private contexts; the in-memory UI still works.
  }

  await runTransaction("readwrite", (store) =>
    store.put({
      noteId,
      payload: { ...existing?.payload, ...payload },
      updatedAt: Date.now(),
    } satisfies PendingNoteUpdate),
  );
}

export async function getQueuedNoteUpdates(): Promise<PendingNoteUpdate[]> {
  const updates = await runTransaction<PendingNoteUpdate[]>("readonly", (store) =>
    store.getAll(),
  );

  return updates.sort((a, b) => a.updatedAt - b.updatedAt);
}

export async function removeQueuedNoteUpdate(noteId: string): Promise<void> {
  await runTransaction("readwrite", (store) => store.delete(noteId));
}
