import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getFoldersApi,
  getFolderByIdApi,
  createFolderApi,
  updateFolderApi,
  deleteFolderApi,
  moveNoteToFolderApi,
} from "@/api/folders.api";

export const useFolders = () =>
  useQuery({
    queryKey: ["folders"],
    queryFn: getFoldersApi,
  });

export const useFolder = (id: string) =>
  useQuery({
    queryKey: ["folders", id],
    queryFn: () => getFolderByIdApi(id),
    enabled: !!id,
  });

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createFolderApi(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateFolderApi(id, name),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", id] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFolderApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};

export const useMoveNoteToFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      folderId,
    }: {
      noteId: string;
      folderId: string | null;
    }) => moveNoteToFolderApi(noteId, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};
