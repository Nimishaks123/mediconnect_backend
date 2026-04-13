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
} from "../validation/authValidation";
import { validateRequest } from "../middlewares/validateRequest";

export function authRoutes(authController: AuthController) {
  const router = Router();

  router.post(
    "/signup",
    validateRequest(signupSchema),
    authController.signup.bind(authController)
  );

  router.post(
    "/verify-otp",
    validateRequest(verifyOtpSchema),
    authController.verifyOtp.bind(authController)
  );

  router.post(
    "/resend-otp",
    validateRequest(resendOtpSchema),
    authController.resendOtp.bind(authController)
  );

  router.post(
    "/login",
    validateRequest(loginSchema),
    authController.login.bind(authController)
  );

  router.post(
    "/refresh",
    authController.refresh.bind(authController)
  );

  router.post(
    "/forgot-password/send-otp",
    validateRequest(forgotPasswordSendOtpSchema),
    authController.sendForgotPasswordOtp.bind(authController)
  );

  router.post(
    "/forgot-password/verify-otp",
    validateRequest(forgotPasswordVerifyOtpSchema),
    authController.verifyForgotPasswordOtp.bind(authController)
  );

  router.post(
    "/forgot-password/reset",
    validateRequest(forgotPasswordResetSchema),
    authController.resetPassword.bind(authController)
  );

  //  GOOGLE OAUTH 
  router.get(
    "/google",
    authController.googleAuthUrl.bind(authController)
  );

  router.get(
    "/google/callback",
    authController.googleCallback.bind(authController)
  );

  console.log("AUTH ROUTES LOADED ✔");

  return router;
}
