import { Request, Response, NextFunction } from "express";
import { TokenService } from "../../application/services/TokenService";
import { config } from "../../common/config";

const tokenService = new TokenService(
  config.accessTokenSecret,
  config.accessTokenExpiry,
  config.refreshTokenSecret,
  config.refreshTokenExpiry
);


export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = tokenService.verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
