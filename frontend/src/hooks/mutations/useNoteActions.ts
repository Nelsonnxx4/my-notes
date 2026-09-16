import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteNote, updateNote } from "@/api/notes.api";
import { getToastErrorMessage, notify } from "@/utils/toast";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      notify({
        title: "Note deleted",
        description: "The note was removed.",
        severity: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Note not deleted",
        description: getToastErrorMessage(error),
        severity: "danger",
      });
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
      notify({
        title: "Note archived",
        description: "You can find it in Archive.",
        severity: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Note not archived",
        description: getToastErrorMessage(error),
        severity: "danger",
      });
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
      notify({
        title: "Note restored",
        description: "The note is back in your notes.",
        severity: "success",
      });
    },
    onError: (error) => {
      notify({
        title: "Note not restored",
        description: getToastErrorMessage(error),
        severity: "danger",
      });
    },
  });
};
