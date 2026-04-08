import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiResponse } from "../types";

/** Validate request body against a Zod schema, returning 422 on failure */
export function validate(schema: ZodSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const path = issue.path.join(".");
          fieldErrors[path] = issue.message;
        }

        const response: ApiResponse = {
          success: false,
          message: "Validation failed",
          errors: fieldErrors,
        };

        res.status(422).json(response);
        return;
      }
      next(error);
    }
  };
}
