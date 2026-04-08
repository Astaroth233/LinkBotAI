import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload, ApiResponse } from "../types";
import { env } from "../config/env";

/** Verify JWT access token from cookies and attach user to request */
export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    const response: ApiResponse = {
      success: false,
      message: "Access token missing. Please log in.",
    };
    res.status(401).json(response);
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    const response: ApiResponse = {
      success: false,
      message: "Invalid or expired access token",
    };
    res.status(401).json(response);
  }
}
