import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../types";

/** Mongoose document type for User */
export interface UserDocument extends Omit<IUser, "_id">, Document {}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

/** User model with typed Document generics */
export const User = mongoose.model<UserDocument>("User", userSchema);
