import { Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { AppError } from "@common/AppError";

/**
 * Middleware factory to restrict access to specific roles.
 * Must be used AFTER authMiddleware.
 */
export const allowRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(`Access denied: requires one of [${roles.join(", ")}]`, 403);
    }

    next();
  };
};

/**
 * Reusable role-specific middleware sets.
 * Note: These are factories that take the 'auth' middleware instance.
 */
export const requireAdmin = (auth: RequestHandler) => [auth, allowRoles(UserRole.ADMIN)];
export const requirePatient = (auth: RequestHandler) => [auth, allowRoles(UserRole.PATIENT)];
export const requireDoctor = (auth: RequestHandler) => [auth, allowRoles(UserRole.DOCTOR)];

