import { useQuery } from "@tanstack/react-query";

import { getNotes } from "@/api/notes.api";

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],

    queryFn: getNotes,
  });
};
