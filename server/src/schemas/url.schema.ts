import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z.string().url("Must be a valid URL"),
  useAi: z.boolean().optional().default(false),
  customCode: z.string().min(3).max(20).regex(/^[a-zA-Z0-9-_]+$/, "Only letters, numbers, hyphens and underscores").optional(),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
