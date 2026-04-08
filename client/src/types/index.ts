/** User roles available in the system */
export type UserRole = "user" | "admin";

/** User interface for client-side use */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

/** Chat interface */
export interface Chat {
  _id: string;
  userId: string;
  title: string;
  model: string;
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
}

/** Message interface */
export interface Message {
  _id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens?: number;
  createdAt: string;
}

/** Standard API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

/** Chat message format used by OpenAI */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/** Login form input */
export interface LoginInput {
  email: string;
  password: string;
}

/** Register form input */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/** Shortened URL interface */
export interface ShortUrl {
  _id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  title: string;
  clicks: number;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Create short URL input */
export interface CreateUrlInput {
  originalUrl: string;
  useAi?: boolean;
  customCode?: string;
}
export interface CreateChatInput {
  title?: string;
  model?: "deepseek/deepseek-chat" | "deepseek/deepseek-r1" | "meta-llama/llama-3.3-70b-instruct" | "google/gemini-2.0-flash-001";
}
