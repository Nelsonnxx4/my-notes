import type { Note } from "@/types";

import { api } from "./axios";

export const getFavoritesApi = async (): Promise<Note[]> => {
  const { data } = await api.get<Note[]>("/favorites");

  return data;
};

export const addFavoriteApi = async (
  noteId: string,
): Promise<{ message: string; note: Note }> => {
  const { data } = await api.post(`/favorites/${noteId}`);

  return data;
};

export const removeFavoriteApi = async (
  noteId: string,
): Promise<{ message: string; note: Note }> => {
  const { data } = await api.delete(`/favorites/${noteId}`);

  return data;
};
