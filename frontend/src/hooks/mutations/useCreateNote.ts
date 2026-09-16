import type { CreateNotePayload, Note } from "@/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/api/notes.api";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
