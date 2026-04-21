import {
  approveDoctorSchema,
  rejectDoctorSchema,
  blockUserSchema,
  unblockUserSchema,
  getAllUsersSchema,
} from "../validation/adminValidation";

import { AdminController } from "../controllers/AdminController";

import { Router, RequestHandler } from "express";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { requireAdmin } from "../middlewares/roleMiddleware";

export function adminProtectedRoutes(adminController: AdminController, authMiddleware: RequestHandler) {
  const router = Router();

  // Apply admin protection to all routes in this router
  router.use(...requireAdmin(authMiddleware));


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
