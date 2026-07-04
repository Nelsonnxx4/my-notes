import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteNote, updateNote } from "@/api/notes.api";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useArchiveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateNote(id, { is_archived: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", "archived"] });
    },
  });
};

export const useUnarchiveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateNote(id, { is_archived: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", "archived"] });
    },
  });
};
