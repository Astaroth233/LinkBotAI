import mongoose, { Schema, type InferSchemaType } from "mongoose";

const messageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/** Inferred document type for Message */
export type MessageDocument = InferSchemaType<typeof messageSchema>;

/** Message model with typed Document generics */
export const Message = mongoose.model("Message", messageSchema);
