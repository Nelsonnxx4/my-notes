import { api } from "./axios";

export interface Folder {
  id: string;
  name: string;
  userId: string;
  noteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FolderWithNotes extends Folder {
  notes: any[];
}

export const getFoldersApi = async (): Promise<Folder[]> => {
  const { data } = await api.get<Folder[]>("/folders");

  return data;
};

export const getFolderByIdApi = async (
  id: string,
): Promise<FolderWithNotes> => {
  const { data } = await api.get<FolderWithNotes>(`/folders/${id}`);

  return data;
};

export const createFolderApi = async (name: string): Promise<Folder> => {
  const { data } = await api.post<Folder>("/folders", { name });

  return data;
};

export const updateFolderApi = async (
  id: string,
  name: string,
): Promise<Folder> => {
  const { data } = await api.patch<Folder>(`/folders/${id}`, { name });

  return data;
};

export const deleteFolderApi = async (
  id: string,
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/folders/${id}`);

  return data;
};

export const moveNoteToFolderApi = async (
  noteId: string,
  folderId: string | null,
): Promise<{ id: string; folderId: string | null }> => {
  const { data } = await api.patch(`/folders/move/${noteId}`, {
    folder_id: folderId,
  });

  return data;
};
