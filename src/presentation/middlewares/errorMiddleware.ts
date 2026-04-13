import { Request, Response, NextFunction } from "express";
import { AppError } from "@common/AppError";
import logger from "@common/logger";
import { DomainError } from "@domain/errors/DomainError";
import { ErrorMapper } from "../utils/ErrorMapper";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let err = error;

  // Domain Error → AppError mapping
  if (err instanceof DomainError) {
    err = ErrorMapper.toAppError(err);
  }

  if (err instanceof AppError) {
    // Log operational errors as WARN
    logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode, stack: err.stack });
    
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Log unexpected/system errors as ERROR
  logger.error("Unhandled Exception:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
