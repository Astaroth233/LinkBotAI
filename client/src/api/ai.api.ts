import axiosInstance from "./axiosInstance";
import type { ApiResponse, Message, ChatMessage } from "@/types";

/** Generate a non-streaming AI response */
export async function generateMessage(
  chatId: string,
  content: string
): Promise<ApiResponse<{ message: Message }>> {
  const res = await axiosInstance.post<ApiResponse<{ message: Message }>>("/ai/generate", {
    chatId,
    content,
  });
  return res.data;
}

/** Get the SSE stream URL for a given chat message (used by EventSource) */
export function getStreamUrl(chatId: string, content: string): string {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const params = new URLSearchParams({ chatId, content });
  return `${baseURL}/ai/stream?${params.toString()}`;
}

/** Placeholder to keep ChatMessage type usage */
export type { ChatMessage };
