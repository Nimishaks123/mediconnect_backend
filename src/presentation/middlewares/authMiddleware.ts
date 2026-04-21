import { Response, NextFunction } from "express";
import { AppError } from "@common/AppError";
import { ITokenService } from "../../application/interfaces/auth/ITokenService";
import { AuthenticatedRequest as BaseAuthenticatedRequest } from "../../types/AuthenticatedRequest";

export type AuthenticatedRequest = BaseAuthenticatedRequest;

/**
 * Middleware to authenticate requests using JWT.
 * It checks for the token in:
 * 1. Authorization Header (Bearer <token>)
 * 2. Cookies (accessToken)
 */
export const createAuthMiddleware = (tokenService: ITokenService) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // 1. Check Authorization Header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }

      // 2. Fallback to Cookie
      if (!token && req.cookies) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        // Only throw error if the route explicitly requires authentication
        // If we want this middleware to be "optional" for public routes, 
        // we could just call next(). But here we assume it's applied to protected routes.
        throw new AppError("Authentication token missing", 401);
      }

      const payload = tokenService.verifyAccessToken(token);

      req.user = {
        id: payload.id,
        role: payload.role as any,
      };
      req.token = token;

      next();

    } catch (err) {
      if (err instanceof AppError) {
        return next(err);
      }
      return next(new AppError("Unauthorized: Invalid or expired token", 401));
    }
  };
};

