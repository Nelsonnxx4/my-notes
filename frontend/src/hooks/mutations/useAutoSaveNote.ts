import type { UpdateNotePayload, Note } from "@/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNote } from "@/api/notes.api";

export const useAutoSaveNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, { id: string; payload: UpdateNotePayload }>({
    mutationFn: ({ id, payload }) => updateNote(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
