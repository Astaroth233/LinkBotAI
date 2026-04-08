import { Response } from "express";
import { Chat } from "../models/Chat.model";
import { Message } from "../models/Message.model";
import { AuthRequest, ApiResponse } from "../types";
import { CreateChatInput } from "../schemas/chat.schema";

/** Get all chats for the authenticated user, sorted newest first */
export async function getChats(req: AuthRequest, res: Response): Promise<void> {
  const chats = await Chat.find({ userId: req.user?.id }).sort({ createdAt: -1 });

  const response: ApiResponse<{ chats: typeof chats }> = {
    success: true,
    message: "Chats retrieved",
    data: { chats },
  };
  res.status(200).json(response);
}

/** Create a new chat for the authenticated user */
export async function createChat(req: AuthRequest, res: Response): Promise<void> {
  const { title, model } = req.body as CreateChatInput;

  const chat = await Chat.create({
    userId: req.user?.id,
    title: title || "New Chat",
    model: model || "deepseek/deepseek-chat",
  });

  const response: ApiResponse<{ chat: typeof chat }> = {
    success: true,
    message: "Chat created",
    data: { chat },
  };
  res.status(201).json(response);
}

/** Get a single chat by ID with its messages */
export async function getChatById(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const chat = await Chat.findOne({ _id: id, userId: req.user?.id });
  if (!chat) {
    const response: ApiResponse = {
      success: false,
      message: "Chat not found",
    };
    res.status(404).json(response);
    return;
  }

  const messages = await Message.find({ chatId: id }).sort({ createdAt: 1 });

  const response: ApiResponse<{ chat: typeof chat; messages: typeof messages }> = {
    success: true,
    message: "Chat retrieved",
    data: { chat, messages },
  };
  res.status(200).json(response);
}

/** Delete a chat and all its messages */
export async function deleteChat(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const chat = await Chat.findOne({ _id: id, userId: req.user?.id });
  if (!chat) {
    const response: ApiResponse = {
      success: false,
      message: "Chat not found",
    };
    res.status(404).json(response);
    return;
  }

  await Message.deleteMany({ chatId: id });
  await Chat.findByIdAndDelete(id);

  const response: ApiResponse = {
    success: true,
    message: "Chat deleted",
  };
  res.status(200).json(response);
}
