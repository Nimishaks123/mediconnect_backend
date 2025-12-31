import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as {
        body: any;
        params: Record<string, string>;
        query: Record<string, any>;
      };

      req.body = validated.body;
      req.params = validated.params as any;
      req.query = validated.query as any;

      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: error.errors,
      });
    }
  };
};
