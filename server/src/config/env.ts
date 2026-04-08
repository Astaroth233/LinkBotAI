import { z } from "zod";

/** Schema to validate all required environment variables at startup */
const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),
  CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),
  SHORT_BASE_URL: z.string().url().default("http://localhost:5000/api"),
});

/** Validated and typed environment configuration */
export const env = envSchema.parse(process.env);

/** TypeScript type for the env config */
export type Env = z.infer<typeof envSchema>;
