import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUrls, createUrl, deleteUrl } from "@/api/url.api";
import type { CreateUrlInput } from "@/types";

export function useUrls() {
  return useQuery({
    queryKey: ["urls"],
    queryFn: async () => {
      const res = await getUrls();
      return res.data?.urls ?? [];
    },
  });
}

export function useCreateUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUrlInput) => createUrl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUrl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
  });
}
