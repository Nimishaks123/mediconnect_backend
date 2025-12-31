
import { AdminController } from "../controllers/AdminController";

import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
//import { adminLoginSchema } from "../validation/adminValidation";
import {
  approveDoctorSchema,
  rejectDoctorSchema,
  adminLoginSchema,
  blockUserSchema,
  unblockUserSchema,
} from "../validation/adminValidation";

export function adminAuthRoutes(adminController: AdminController) {
  const router = Router();

  router.post(
    "/login",
    validateRequest(adminLoginSchema),
    adminController.login
  );
  router.get("/pending-doctors", adminController.getPendingDoctors);

  // Approve doctor
  router.post(
    "/approve-doctor",
    validateRequest(approveDoctorSchema),
    adminController.approveDoctor
  );

  // Reject doctor
  router.post(
    "/reject-doctor",
    validateRequest(rejectDoctorSchema),
    adminController.rejectDoctor
  );

  // Block user
  router.post(
    "/block-user",
    validateRequest(blockUserSchema),
    adminController.blockUser
  );

  // Unblock user
  router.post(
    "/unblock-user",
    validateRequest(unblockUserSchema),
    adminController.unblockUser
  );
  router.get("/users", adminController.getAllUsers);

  return router;
}
