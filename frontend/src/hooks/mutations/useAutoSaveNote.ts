import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNote } from "@/api/notes.api";

export const useAutoSaveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateNote(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["note", variables.id],
      });
    },
  });
};
