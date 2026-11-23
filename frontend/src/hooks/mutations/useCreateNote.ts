import type { CreateNotePayload, Note } from "@/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createNote } from "@/api/notes.api";
import { broadcastNotesChanged } from "@/lib/noteEvents";
import { sanitizeNoteHtml } from "@/lib/sanitizeHtml";

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Note, Error, CreateNotePayload>({
    mutationFn: (payload) =>
      createNote({
        ...payload,
        ...(payload.content && { content: sanitizeNoteHtml(payload.content) }),
      }),
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      broadcastNotesChanged();
      navigate(`/notes/${note.id}`);
    },
  });
};
