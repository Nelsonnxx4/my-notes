import type { Note } from "@/types";

import { useQuery } from "@tanstack/react-query";

import { getNotes, getNote, getArchivedNotes } from "@/api/notes.api";

export const useNotes = (params?: { q?: string; tag?: number }) =>
  useQuery<Note[]>({
    queryKey: ["notes", params],
    queryFn: () => getNotes(params),
  });

export const useNote = (noteId: string) =>
  useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => getNote(noteId),
    enabled: !!noteId,
  });

export const useArchivedNotes = () =>
  useQuery<Note[]>({
    queryKey: ["notes", "archived"],
    queryFn: getArchivedNotes,
  });
