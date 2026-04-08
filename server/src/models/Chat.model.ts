import mongoose, { Schema, type InferSchemaType } from "mongoose";

const chatSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    model: {
      type: String,
      default: "deepseek/deepseek-chat",
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/** Inferred document type for Chat */
export type ChatDocument = InferSchemaType<typeof chatSchema>;

/** Chat model with typed Document generics */
export const Chat = mongoose.model("Chat", chatSchema);
