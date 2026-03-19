import type { Note, CreateNotePayload, UpdateNotePayload } from "@/types";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/apiClient";
import { useAppSelector } from "@/stores/hooks";

export const useNotes = () => {
  const activeTagId = useAppSelector((s) => s.ui.activeTagId);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);

  return useQuery<Note[]>({
    queryKey: ["notes", activeTagId, searchQuery],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (activeTagId) params.tag = String(activeTagId);
      if (searchQuery) params.q = searchQuery;

      const { data } = await apiClient.get("/notes", { params });

      return data;
    },
  });
};

// Fetch a single note by ID
export const useNote = (id: string | null) => {
  return useQuery<Note>({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/notes/${id}`);

      return data;
    },
    enabled: !!id, // only runs when an id is selected
  });
};

// Create a new note
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateNotePayload) => {
      const { data } = await apiClient.post("/notes", payload);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

// Update an existing note
export const useUpdateNote = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateNotePayload) => {
      const { data } = await apiClient.patch(`/notes/${id}`, payload);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", id] });
    },
  });
};

// Delete a note
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

// Toggle pin on a note
export const usePinNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_pinned,
    }: {
      id: string;
      is_pinned: boolean;
    }) => {
      const { data } = await apiClient.patch(`/notes/${id}`, { is_pinned });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
