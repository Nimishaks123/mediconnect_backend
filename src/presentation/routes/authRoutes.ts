import { Router, RequestHandler } from "express";
import { AuthController } from "../controllers/AuthController";
import { 
  signupSchema, 
  loginSchema, 
  verifyOtpSchema, 
  resendOtpSchema,
  forgotPasswordSendOtpSchema,
  forgotPasswordVerifyOtpSchema,
  forgotPasswordResetSchema,
  refreshTokenSchema,
  googleCallbackSchema
} from "../validation/authValidation";
import { validateRequest } from "@presentation/middlewares/validateRequest";

/**
 * Route definitions for authentication.
 */
export function authRoutes(authController: AuthController, authMiddleware: RequestHandler) {
  const router = Router();

  // Standard Email/Password Auth
  router.post("/signup", validateRequest(signupSchema), authController.signup);
  router.post("/login", validateRequest(loginSchema), authController.login);
  router.post("/verify-otp", validateRequest(verifyOtpSchema), authController.verifyOtp);
  router.post("/resend-otp", validateRequest(resendOtpSchema), authController.resendOtp);
  router.post("/refresh", validateRequest(refreshTokenSchema), authController.refresh);

  // Session Management
  router.get("/me", authMiddleware, authController.getMe);
  router.post("/logout", authController.logout);

  // Forgot Password Flow
  router.post("/forgot-password/send-otp", validateRequest(forgotPasswordSendOtpSchema), authController.sendForgotPasswordOtp);
  router.post("/forgot-password/verify-otp", validateRequest(forgotPasswordVerifyOtpSchema), authController.verifyForgotPasswordOtp);
  router.post("/forgot-password/reset", validateRequest(forgotPasswordResetSchema), authController.resetPassword);

  // Google OAuth 2.0
  router.get("/google", authController.googleAuthUrl);
  router.get("/google/callback", validateRequest(googleCallbackSchema), authController.googleCallback);

  return router;
}

