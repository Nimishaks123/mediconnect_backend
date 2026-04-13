import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { UserRole } from "@application/constants/UserRole";

export const allowRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: requires one of [${roles.join(", ")}]`,
      });
    }

    next();
  };
};
