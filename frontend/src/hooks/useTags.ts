import type { Tag } from "@/types";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/apiClient";

export const useTags = () => {
  return useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await apiClient.get("/tags");

      return data;
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiClient.post("/tags", { name });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
