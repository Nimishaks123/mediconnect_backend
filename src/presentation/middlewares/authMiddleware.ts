import { Response, NextFunction } from "express";
import { AppError } from "@common/AppError";
import { ITokenService } from "../../application/interfaces/auth/ITokenService";
import { AuthenticatedRequest as BaseAuthenticatedRequest } from "../../types/AuthenticatedRequest";

// Re-export for backward compatibility
export type AuthenticatedRequest = BaseAuthenticatedRequest;

export const createAuthMiddleware = (tokenService: ITokenService) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized: No token provided", 401);
      }

      const token = authHeader.split(" ")[1];
      const payload = tokenService.verifyAccessToken(token);

      req.user = {
        id: payload.id,
        role: payload.role,
      };

      next();
    } catch (err) {
      if (err instanceof AppError) {
        return next(err);
      }
      return next(new AppError("Unauthorized: Invalid token", 401));
    }
  };
};
