import type { AxiosError } from "axios";
import type { ApiErrorResponse, UpdateNotePayload, Note } from "@/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNote } from "@/api/notes.api";

export const useAutoSaveNote = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Note,
    AxiosError<ApiErrorResponse>,
    { id: string; payload: UpdateNotePayload }
  >({
    mutationFn: ({ id, payload }) => updateNote(id, payload),
    onSuccess: (note, { id }) => {
      queryClient.setQueryData(["note", id], note);
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
