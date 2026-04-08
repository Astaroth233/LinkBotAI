import { z } from "zod";

/** Schema for creating a new chat */
export const createChatSchema = z.object({
  title: z.string().optional(),
  model: z.enum(["deepseek/deepseek-chat", "deepseek/deepseek-r1", "meta-llama/llama-3.3-70b-instruct", "google/gemini-2.0-flash-001"]).optional(),
});

/** Schema for sending a message */
export const messageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  chatId: z.string().min(1, "Chat ID is required"),
});

/** Inferred TypeScript type for creating a chat */
export type CreateChatInput = z.infer<typeof createChatSchema>;

/** Inferred TypeScript type for sending a message */
export type MessageInput = z.infer<typeof messageSchema>;
