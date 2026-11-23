import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getQueuedNoteUpdates,
  listenForQueuedNoteChanges,
  queueNoteUpdate,
  removeQueuedNoteUpdate,
} from "@/lib/offlineMutationQueue";

const noteId = "offline-note";

afterEach(async () => {
  await removeQueuedNoteUpdate(noteId);
});

describe("offline mutation queue", () => {
  it("keeps and merges updates when IndexedDB is unavailable", async () => {
    await queueNoteUpdate(noteId, { title: "Draft" });
    await queueNoteUpdate(noteId, { content: "<p>Kept offline</p>" });

    expect(await getQueuedNoteUpdates()).toEqual([
      expect.objectContaining({
        noteId,
        payload: {
          title: "Draft",
          content: "<p>Kept offline</p>",
        },
      }),
    ]);
  });

  it("notifies sync status when the queue changes", async () => {
    const listener = vi.fn();
    const stopListening = listenForQueuedNoteChanges(listener);

    await queueNoteUpdate(noteId, { title: "Queued" });
    expect(listener).toHaveBeenCalledOnce();

    await removeQueuedNoteUpdate(noteId);
    expect(listener).toHaveBeenCalledTimes(2);
    stopListening();
  });
});
