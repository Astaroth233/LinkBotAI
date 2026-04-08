import jwt, { type SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types";
import { env } from "../config/env";

/** Generate a short-lived access token */
export function generateAccessToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"] };
  return jwt.sign(
    { id: payload.id, role: payload.role },
    env.JWT_ACCESS_SECRET,
    options
  );
}

/** Generate a long-lived refresh token */
export function generateRefreshToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRY as SignOptions["expiresIn"] };
  return jwt.sign(
    { id: payload.id, role: payload.role },
    env.JWT_REFRESH_SECRET,
    options
  );
}
