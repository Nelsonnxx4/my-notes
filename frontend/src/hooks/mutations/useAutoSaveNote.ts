import type { UpdateNotePayload, Note } from "@/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNote } from "@/api/notes.api";
import { useSyncStatus } from "@/contexts/SyncStatusContext";
import { broadcastNotesChanged } from "@/lib/noteEvents";
import { queueNoteUpdate } from "@/lib/offlineMutationQueue";
import { sanitizeNoteHtml } from "@/lib/sanitizeHtml";

function applyUpdate(note: Note, payload: UpdateNotePayload): Note {
  return {
    ...note,
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.content !== undefined && { content: payload.content }),
    ...(payload.is_pinned !== undefined && { isPinned: payload.is_pinned }),
    ...(payload.is_archived !== undefined && { isArchived: payload.is_archived }),
    ...(payload.is_favorite !== undefined && { isFavorite: payload.is_favorite }),
    ...(payload.folder_id !== undefined && { folderId: payload.folder_id }),
  };
}

export const useAutoSaveNote = () => {
  const queryClient = useQueryClient();
  const sync = useSyncStatus();

  return useMutation<Note, Error, { id: string; payload: UpdateNotePayload }>({
    mutationFn: ({ id, payload }) =>
      updateNote(id, {
        ...payload,
        ...(payload.content !== undefined && {
          content: sanitizeNoteHtml(payload.content),
        }),
      }),
    onMutate: async ({ id, payload }) => {
      sync.setSaving();
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueriesData<Note[]>({ queryKey: ["notes"] });
      const previousNote = queryClient.getQueryData<Note>(["note", id]);

      queryClient.setQueriesData<Note[]>({ queryKey: ["notes"] }, (notes) =>
        notes?.map((note) => (note.id === id ? applyUpdate(note, payload) : note)),
      );
      queryClient.setQueryData<Note>(["note", id], (note) =>
        note ? applyUpdate(note, payload) : note,
      );

      return { previousNotes, previousNote };
    },
    onSuccess: () => {
      sync.setSaved();
      broadcastNotesChanged();
    },
    onError: async (error, { id, payload }) => {
      const safePayload = {
        ...payload,
        ...(payload.content !== undefined && {
          content: sanitizeNoteHtml(payload.content),
        }),
      };
      await queueNoteUpdate(id, safePayload);
      if (navigator.onLine) {
        sync.setError();
      } else {
        sync.setOffline();
      }
      // The optimistic value remains in place so a writer never loses their draft.
      console.warn("Autosave queued for retry", error);
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
