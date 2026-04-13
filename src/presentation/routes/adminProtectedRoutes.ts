import {
  approveDoctorSchema,
  rejectDoctorSchema,
  blockUserSchema,
  unblockUserSchema,
  getAllUsersSchema,
} from "../validation/adminValidation";

import { AdminController } from "../controllers/AdminController";

import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";

export function adminProtectedRoutes(adminController: AdminController) {
  const router = Router();

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
