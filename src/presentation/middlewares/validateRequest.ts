import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
          cookies: req.cookies, 
      }) as any;

      if (validated?.body) req.body = validated.body;
      if (validated?.query) req.query = validated.query;
      if (validated?.params) req.params = validated.params;
      if (validated?.cookies) req.cookies = validated.cookies;
      return next();
    } catch (error: any) {
      console.error("VALIDATION ERROR:", error);
      return next(
        new AppError(
          error?.message || "Validation failed",
          StatusCode.BAD_REQUEST
        )
      );
    }
  };
};