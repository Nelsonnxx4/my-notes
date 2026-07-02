import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getFavoritesApi,
  addFavoriteApi,
  removeFavoriteApi,
} from "@/api/favorites.api";

export const useFavorites = () =>
  useQuery({
    queryKey: ["favorites"],
    queryFn: getFavoritesApi,
  });

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      isFavorite,
    }: {
      noteId: string;
      isFavorite: boolean;
    }) => (isFavorite ? removeFavoriteApi(noteId) : addFavoriteApi(noteId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
};
