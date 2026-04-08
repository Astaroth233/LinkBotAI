import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiResponse } from "../types";

/** Global error handler middleware returning ApiResponse shape */
export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Unhandled error:", err.message);

  const response: ApiResponse = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  res.status(500).json(response);
};
