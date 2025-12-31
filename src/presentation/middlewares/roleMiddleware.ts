import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export const allowRoles = (...roles: ("PATIENT" | "DOCTOR" | "ADMIN")[]) => {
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
