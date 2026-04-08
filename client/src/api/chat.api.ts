import axiosInstance from "./axiosInstance";
import type { ApiResponse, Chat, Message, CreateChatInput } from "@/types";

/** Get all chats for the current user */
export async function getChats(): Promise<ApiResponse<{ chats: Chat[] }>> {
  const res = await axiosInstance.get<ApiResponse<{ chats: Chat[] }>>("/chat");
  return res.data;
}

/** Create a new chat */
export async function createChat(data?: CreateChatInput): Promise<ApiResponse<{ chat: Chat }>> {
  const res = await axiosInstance.post<ApiResponse<{ chat: Chat }>>("/chat", data || {});
  return res.data;
}

/** Get a single chat by ID with its messages */
export async function getChatById(id: string): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> {
  const res = await axiosInstance.get<ApiResponse<{ chat: Chat; messages: Message[] }>>(`/chat/${id}`);
  return res.data;
}

/** Delete a chat by ID */
export async function deleteChat(id: string): Promise<ApiResponse> {
  const res = await axiosInstance.delete<ApiResponse>(`/chat/${id}`);
  return res.data;
}
