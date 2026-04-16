import {
  approveDoctorSchema,
  rejectDoctorSchema,
  blockUserSchema,
  unblockUserSchema,
  getAllUsersSchema,
} from "../validation/adminValidation";

import { AdminController } from "../controllers/AdminController";

import { Router, RequestHandler } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";

export function adminProtectedRoutes(adminController: AdminController, authMiddleware: RequestHandler) {
  const router = Router();

  // Apply authentication and role-based authorization to all routes
  router.use(authMiddleware);
  router.use(allowRoles(UserRole.ADMIN));

  router.get("/doctors", adminController.getDoctors);

  router.post(
    "/approve-doctor",
    validateRequest(approveDoctorSchema),
    adminController.approveDoctor
  );

  router.post(
    "/reject-doctor",
    validateRequest(rejectDoctorSchema),
    adminController.rejectDoctor
  );

  router.post(
    "/block-user",
    validateRequest(blockUserSchema),
    adminController.blockUser
  );

  router.post(
    "/unblock-user",
    validateRequest(unblockUserSchema),
    adminController.unblockUser
  );

  router.get(
    "/users",
    validateRequest(getAllUsersSchema),
    adminController.getAllUsers
  );

  return router;
}
