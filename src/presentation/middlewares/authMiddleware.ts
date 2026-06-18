import { Response, NextFunction } from "express";
import { AppError } from "@common/AppError";
import { ITokenService } from "../../application/interfaces/auth/ITokenService";
import { AuthenticatedRequest as BaseAuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { StatusCode } from "@common/enums";
export type AuthenticatedRequest = BaseAuthenticatedRequest;

//Middleware to authenticate requests using JWT.
export const createAuthMiddleware = (tokenService: ITokenService,userRepo:IUserRepository) => {
  return async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
        throw new AppError("Authentication token missing", 401);
      }

      const payload = tokenService.verifyAccessToken(token);
      console.log("JWT PAYLOAD:", payload);
      if(payload.role!=="ADMIN"){
        const user=await userRepo.findById(payload.id);
      console.log("DB USER:", user);
      if(!user){
        throw new AppError("user not found",StatusCode.NOT_FOUND);
      }
      if(user.isBlocked()){
        throw new AppError("your account has been blocked by administrator",StatusCode.FORBIDDEN);
      }


      }
      
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

