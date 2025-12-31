import { Request, Response, NextFunction } from "express";
import logger from "../../common/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const level =
      res.statusCode >= 500 ? "error" :
      res.statusCode >= 400 ? "warn" :
      "info";

    const url = req.originalUrl.split("?")[0];

    const message = `[${req.method}] ${url} -> ${res.statusCode} (${duration}ms)`;

    logger.log(level, message);
  });

  next();
};
