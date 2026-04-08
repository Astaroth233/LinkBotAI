import { Response } from "express";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Chat } from "../models/Chat.model";
import { Message } from "../models/Message.model";
import { AuthRequest, ApiResponse } from "../types";
import { MessageInput } from "../schemas/chat.schema";
import { env } from "../config/env";

const openai = new OpenAI({
  apiKey: env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": env.CLIENT_URL,
    "X-Title": "LinkBotAI",
  },
});

/** Generate an AI response (non-streaming) and save messages */
export async function generateMessage(req: AuthRequest, res: Response): Promise<void> {
  const { content, chatId } = req.body as MessageInput;

  const chat = await Chat.findOne({ _id: chatId, userId: req.user?.id });
  if (!chat) {
    const response: ApiResponse = {
      success: false,
      message: "Chat not found",
    };
    res.status(404).json(response);
    return;
  }

  // Save user message
  await Message.create({ chatId, role: "user", content });

  // Build conversation history
  const previousMessages = await Message.find({ chatId }).sort({ createdAt: 1 });
  const messages: ChatCompletionMessageParam[] = previousMessages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }));

  const completion = await openai.chat.completions.create({
    model: chat.model,
    messages,
  });

  const reply = completion.choices[0]?.message?.content || "";
  const totalTokens = completion.usage?.total_tokens || 0;

  // Save assistant message
  const assistantMessage = await Message.create({
    chatId,
    role: "assistant",
    content: reply,
    tokens: totalTokens,
  });

  // Update chat total tokens
  chat.totalTokens += totalTokens;
  await chat.save();

  const response: ApiResponse<{ message: typeof assistantMessage }> = {
    success: true,
    message: "Response generated",
    data: { message: assistantMessage },
  };
  res.status(200).json(response);
}

/** Stream an AI response via SSE */
export async function streamMessage(req: AuthRequest, res: Response): Promise<void> {
  const chatId = req.query.chatId as string | undefined;
  const content = req.query.content as string | undefined;

  if (!chatId || !content) {
    const response: ApiResponse = {
      success: false,
      message: "chatId and content query parameters are required",
    };
    res.status(400).json(response);
    return;
  }

  const chat = await Chat.findOne({ _id: chatId, userId: req.user?.id });
  if (!chat) {
    const response: ApiResponse = {
      success: false,
      message: "Chat not found",
    };
    res.status(404).json(response);
    return;
  }

  // Save user message
  await Message.create({ chatId, role: "user", content });

  // Build conversation history
  const previousMessages = await Message.find({ chatId }).sort({ createdAt: 1 });
  const messages: ChatCompletionMessageParam[] = previousMessages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }));

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let fullContent = "";

  try {
    const stream = await openai.chat.completions.create({
      model: chat.model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        fullContent += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    // Save assistant message
    await Message.create({
      chatId,
      role: "assistant",
      content: fullContent,
    });

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Stream error";
    res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
    res.end();
  }
}
