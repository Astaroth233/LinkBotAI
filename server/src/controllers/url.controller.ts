import { Response } from "express";
import { nanoid } from "nanoid";
import OpenAI from "openai";
import { Url } from "../models/Url.model";
import { AuthRequest, ApiResponse } from "../types";
import { CreateUrlInput } from "../schemas/url.schema";
import { env } from "../config/env";

/** Generate a random short code without AI */
function generateShortCode(): string {
  return nanoid(7);
}

/** Use AI to generate a meaningful slug from the URL */
async function generateAiSlug(originalUrl: string): Promise<string> {
  const client = new OpenAI({
    apiKey: env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": env.CLIENT_URL,
      "X-Title": "LinkBotAI",
    },
  });

  const completion = await client.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "You generate short, memorable URL slugs. Respond with ONLY the slug — no explanation, no punctuation, no quotes. Max 15 chars, lowercase, hyphens allowed, no spaces.",
      },
      {
        role: "user",
        content: `Generate a slug for this URL: ${originalUrl}`,
      },
    ],
    max_tokens: 20,
  });

  const slug = completion.choices[0]?.message?.content?.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 15) || nanoid(7);
  return slug;
}

/** Get all shortened URLs for the authenticated user */
export async function getUrls(req: AuthRequest, res: Response): Promise<void> {
  const urls = await Url.find({ userId: req.user?.id }).sort({ createdAt: -1 });
  const response: ApiResponse<{ urls: typeof urls }> = {
    success: true,
    message: "URLs retrieved",
    data: { urls },
  };
  res.status(200).json(response);
}

/** Create a shortened URL (with or without AI) */
export async function createUrl(req: AuthRequest, res: Response): Promise<void> {
  const { originalUrl, useAi, customCode } = req.body as CreateUrlInput;

  // Check custom code availability
  if (customCode) {
    const existing = await Url.findOne({ shortCode: customCode });
    if (existing) {
      const response: ApiResponse = { success: false, message: "Custom code already taken" };
      res.status(409).json(response);
      return;
    }
  }

  let shortCode: string;
  let aiGenerated = false;

  if (customCode) {
    shortCode = customCode;
  } else if (useAi) {
    try {
      const aiSlug = await generateAiSlug(originalUrl);
      // Ensure uniqueness — append random suffix if taken
      const exists = await Url.findOne({ shortCode: aiSlug });
      shortCode = exists ? `${aiSlug}-${nanoid(3)}` : aiSlug;
      aiGenerated = true;
    } catch {
      // Fallback to random if AI fails
      shortCode = generateShortCode();
    }
  } else {
    shortCode = generateShortCode();
  }

  const url = await Url.create({
    userId: req.user?.id,
    originalUrl,
    shortCode,
    aiGenerated,
  });

  const response: ApiResponse<{ url: typeof url; shortUrl: string }> = {
    success: true,
    message: "URL shortened successfully",
    data: { url, shortUrl: `${env.SHORT_BASE_URL}/r/${shortCode}` },
  };
  res.status(201).json(response);
}

/** Redirect to original URL and increment click count */
export async function redirectUrl(req: AuthRequest, res: Response): Promise<void> {
  const { code } = req.params;

  const url = await Url.findOneAndUpdate(
    { shortCode: code },
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (!url) {
    const response: ApiResponse = { success: false, message: "Short URL not found" };
    res.status(404).json(response);
    return;
  }

  res.redirect(url.originalUrl);
}

/** Delete a shortened URL */
export async function deleteUrl(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const url = await Url.findOneAndDelete({ _id: id, userId: req.user?.id });
  if (!url) {
    const response: ApiResponse = { success: false, message: "URL not found" };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse = { success: true, message: "URL deleted" };
  res.status(200).json(response);
}
