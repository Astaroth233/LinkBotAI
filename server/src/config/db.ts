import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    if (env.NODE_ENV !== "production") {
      console.log("MongoDB connected successfully");
    }
  } catch (error: unknown) {
    console.error("MongoDB connection error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
