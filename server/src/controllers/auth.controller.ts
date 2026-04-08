import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { Chat } from "../models/Chat.model";
import { Message } from "../models/Message.model";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import { setTokenCookies } from "../utils/setCookie";
import { AuthRequest, JwtPayload, ApiResponse } from "../types";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { env } from "../config/env";

/** Register a new user account */
export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as RegisterInput;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const response: ApiResponse = {
      success: false,
      message: "Email already registered",
    };
    res.status(409).json(response);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  const payload: JwtPayload = { id: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = await bcrypt.hash(refreshToken, 12);
  await user.save();

  setTokenCookies(res, accessToken, refreshToken);

  const response: ApiResponse<{ user: { id: string; name: string; email: string; role: string } }> = {
    success: true,
    message: "Registration successful",
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
  res.status(201).json(response);
}

/** Log in an existing user */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email }).select("+refreshToken");
  if (!user) {
    const response: ApiResponse = {
      success: false,
      message: "Invalid email or password",
    };
    res.status(401).json(response);
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const response: ApiResponse = {
      success: false,
      message: "Invalid email or password",
    };
    res.status(401).json(response);
    return;
  }

  const payload: JwtPayload = { id: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = await bcrypt.hash(refreshToken, 12);
  await user.save();

  setTokenCookies(res, accessToken, refreshToken);

  const response: ApiResponse<{ user: { id: string; name: string; email: string; role: string } }> = {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
  res.status(200).json(response);
}

/** Log out and clear tokens */
export async function logout(req: AuthRequest, res: Response): Promise<void> {
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, { $unset: { refreshToken: 1 } });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  const response: ApiResponse = {
    success: true,
    message: "Logged out successfully",
  };
  res.status(200).json(response);
}

/** Refresh the access token using a valid refresh token cookie */
export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refreshToken as string | undefined;

  if (!token) {
    const response: ApiResponse = {
      success: false,
      message: "Refresh token missing",
    };
    res.status(401).json(response);
    return;
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    const response: ApiResponse = {
      success: false,
      message: "Invalid or expired refresh token",
    };
    res.status(401).json(response);
    return;
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || !user.refreshToken) {
    const response: ApiResponse = {
      success: false,
      message: "User not found or token revoked",
    };
    res.status(401).json(response);
    return;
  }

  const isValid = await bcrypt.compare(token, user.refreshToken);
  if (!isValid) {
    const response: ApiResponse = {
      success: false,
      message: "Refresh token mismatch",
    };
    res.status(401).json(response);
    return;
  }

  const payload: JwtPayload = { id: user._id.toString(), role: user.role };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = await bcrypt.hash(newRefreshToken, 12);
  await user.save();

  setTokenCookies(res, newAccessToken, newRefreshToken);

  const response: ApiResponse = {
    success: true,
    message: "Tokens refreshed",
  };
  res.status(200).json(response);
}

/** Get the currently authenticated user */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const response: ApiResponse<JwtPayload | undefined> = {
    success: true,
    message: "Authenticated user",
    data: req.user,
  };
  res.status(200).json(response);
}

/** Get full user profile */
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user?.id).select("-passwordHash");
  if (!user) {
    const response: ApiResponse = {
      success: false,
      message: "User not found",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<{ user: { id: string; name: string; email: string; role: string; createdAt: Date } }> = {
    success: true,
    message: "User profile",
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
  };
  res.status(200).json(response);
}

/** Update user profile (name/email) */
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const { name, email } = req.body as { name?: string; email?: string };

  const user = await User.findById(req.user?.id);
  if (!user) {
    const response: ApiResponse = {
      success: false,
      message: "User not found",
    };
    res.status(404).json(response);
    return;
  }

  if (name) user.name = name;
  if (email) user.email = email;
  await user.save();

  const response: ApiResponse<{ user: { id: string; name: string; email: string; role: string } }> = {
    success: true,
    message: "Profile updated",
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
  res.status(200).json(response);
}

/** Delete user account and cascade delete all chats + messages */
export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;

  const chats = await Chat.find({ userId });
  const chatIds = chats.map((c) => c._id);

  await Message.deleteMany({ chatId: { $in: chatIds } });
  await Chat.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  const response: ApiResponse = {
    success: true,
    message: "Account deleted successfully",
  };
  res.status(200).json(response);
}
