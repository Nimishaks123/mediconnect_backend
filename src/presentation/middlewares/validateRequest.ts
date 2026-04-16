import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      }) as any

      if (validated.body) req.body = validated.body;
      if (validated.params) req.params = validated.params;
      if (validated.query) req.query = validated.query;
      if (validated.cookies) req.cookies = validated.cookies;

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        
        console.error("Validation Error:", message);
        return next(new AppError(message, StatusCode.BAD_REQUEST));
      }
      next(error);
    }
  };
};
