import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChats, createChat, getChatById, deleteChat } from "@/api/chat.api";
import type { CreateChatInput } from "@/types";

/** Hook to fetch all chats for the current user */
export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await getChats();
      return res.data?.chats ?? [];
    },
  });
}

/** Hook to fetch a single chat with messages */
export function useChatById(id: string) {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const res = await getChatById(id);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

/** Hook to create a new chat */
export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: CreateChatInput) => createChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

/** Hook to delete a chat */
export function useDeleteChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteChat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
