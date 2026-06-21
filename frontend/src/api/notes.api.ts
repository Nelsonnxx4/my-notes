import { api } from "./axios";

export const getNotes = async () => {
  const { data } = await api.get("/notes");

  return data;
};

export const getNote = async (noteId: string) => {
  const { data } = await api.get(`/notes/${noteId}`);

  return data;
};

export const createNote = async (payload: any) => {
  const { data } = await api.post("/notes", payload);

  return data;
};

export const updateNote = async (id: string, payload: any) => {
  const { data } = await api.patch(`/notes/${id}`, payload);

  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await api.delete(`/notes/${id}`);

  return data;
};
