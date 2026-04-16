import { Router } from "express";
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
  googleCallbackSchema,
} from "../validation/authValidation";
import { validateRequest } from "../middlewares/validateRequest";

export function authRoutes(authController: AuthController) {
  const router = Router();

  router.post(
    "/signup",
    validateRequest(signupSchema),
    authController.signup
  );

  router.post(
    "/verify-otp",
    validateRequest(verifyOtpSchema),
    authController.verifyOtp
  );

  router.post(
    "/resend-otp",
    validateRequest(resendOtpSchema),
    authController.resendOtp
  );

  router.post(
    "/login",
    validateRequest(loginSchema),
    authController.login
  );

  router.post(
    "/refresh",
    validateRequest(refreshTokenSchema),
    authController.refresh
  );

  router.post(
    "/forgot-password/send-otp",
    validateRequest(forgotPasswordSendOtpSchema),
    authController.sendForgotPasswordOtp
  );

  router.post(
    "/forgot-password/verify-otp",
    validateRequest(forgotPasswordVerifyOtpSchema),
    authController.verifyForgotPasswordOtp
  );

  router.post(
    "/forgot-password/reset",
    validateRequest(forgotPasswordResetSchema),
    authController.resetPassword
  );

  //  GOOGLE OAUTH 
  router.get(
    "/google",
    authController.googleAuthUrl
  );

  router.get(
    "/google/callback",
    validateRequest(googleCallbackSchema),
    authController.googleCallback
  );

  return router;
}
