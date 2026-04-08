import { Request } from "express";

/** User roles available in the system */
export type UserRole = "user" | "admin";

/** Core User interface */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Core Chat interface */
export interface IChat {
  _id: string;
  userId: string;
  title: string;
  model: string;
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Core Message interface */
export interface IMessage {
  _id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens?: number;
  createdAt: Date;
}

/** JWT token payload structure */
export interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/** Extended Express Request with authenticated user */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/** Standard API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}
