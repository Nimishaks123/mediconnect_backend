import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { AppError } from "@common/AppError";

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
