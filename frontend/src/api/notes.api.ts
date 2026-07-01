import type { Note, CreateNotePayload, UpdateNotePayload } from "@/types";

import { api } from "./axios";

export const getNotes = async (params?: {
  q?: string;
  tag?: number;
}): Promise<Note[]> => {
  const { data } = await api.get<Note[]>("/notes", { params });

  return data;
};

export const getNote = async (noteId: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${noteId}`);

  return data;
};

export const getArchivedNotes = async (): Promise<Note[]> => {
  const { data } = await api.get<Note[]>("/notes/archived");

  return data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", payload);

  return data;
};

export const updateNote = async (
  id: string,
  payload: UpdateNotePayload,
): Promise<Note> => {
  const { data } = await api.patch<Note>(`/notes/${id}`, payload);

  return data;
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/notes/${id}`);

  return data;
};
