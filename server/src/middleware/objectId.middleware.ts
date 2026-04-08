import { Request, Response, NextFunction, RequestHandler } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../types";

/** Validate that a route param is a valid MongoDB ObjectId */
export function validateObjectId(param: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
      const response: ApiResponse = { success: false, message: "Invalid ID format" };
      res.status(400).json(response);
      return;
    }
    next();
  };
}
