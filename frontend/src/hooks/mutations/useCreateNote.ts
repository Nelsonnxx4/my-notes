import type { CreateNotePayload, Note } from "@/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createNote } from "@/api/notes.api";

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate(`/notes/${note.id}`);
    },
  });
};
