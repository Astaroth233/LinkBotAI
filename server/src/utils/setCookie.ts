import { Response } from "express";
import { env } from "../config/env";

/** Set HTTP-only secure cookies for both access and refresh tokens */
export function setTokenCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  const isProduction = env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
