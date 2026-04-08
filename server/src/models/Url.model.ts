import mongoose, { Schema, type InferSchemaType } from "mongoose";

const urlSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "",
    },
    clicks: {
      type: Number,
      default: 0,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type UrlDocument = InferSchemaType<typeof urlSchema>;
export const Url = mongoose.model("Url", urlSchema);
