import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getFavoritesApi,
  addFavoriteApi,
  removeFavoriteApi,
} from "@/api/favorites.api";
import { getToastErrorMessage, notify } from "@/utils/toast";

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
    onSuccess: (_, { isFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
      notify({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? "The note was removed from Favorites."
          : "The note was added to Favorites.",
        severity: "success",
      });
    },
    onError: (error, { isFavorite }) => {
      notify({
        title: isFavorite
          ? "Favorite not removed"
          : "Favorite not added",
        description: getToastErrorMessage(error),
        severity: "danger",
      });
    },
  });
};
