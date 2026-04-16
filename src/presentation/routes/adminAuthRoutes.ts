import { AdminController } from "../controllers/AdminController";

import { Router, RequestHandler } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import {
  approveDoctorSchema,
  rejectDoctorSchema,
  adminLoginSchema,
  blockUserSchema,
  unblockUserSchema,
} from "../validation/adminValidation";

export function adminAuthRoutes(adminController: AdminController, authMiddleware: RequestHandler) {
  const router = Router();

  router.post(
    "/login",
    validateRequest(adminLoginSchema),
    adminController.login
  );
  router.get("/pending-doctors", 
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    adminController.getDoctors
  );

  // Approve doctor
  router.post(
    "/approve-doctor",
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    validateRequest(approveDoctorSchema),
    adminController.approveDoctor
  );

  // Reject doctor
  router.post(
    "/reject-doctor",
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    validateRequest(rejectDoctorSchema),
    adminController.rejectDoctor
  );

  // Block user
  router.post(
    "/block-user",
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    validateRequest(blockUserSchema),
    adminController.blockUser
  );

  // Unblock user
  router.post(
    "/unblock-user",
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    validateRequest(unblockUserSchema),
    adminController.unblockUser
  );
  router.get("/users", 
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    adminController.getAllUsers
  );

  return router;
}
