import { Router } from "express";

import { authRoutes } from "./authRoutes";

import { doctorRoutes } from "./doctorRoutes";
//import { adminAuthRoutes } from "./adminAuthRoutes"; //  ONLY ADMIN ROUTES NEEDED
import { adminPublicRoutes } from "./adminPublicRoutes";
import { adminProtectedRoutes } from "./adminProtectedRoutes";
import { AuthController } from "../controllers/AuthController";
import { DoctorController } from "../controllers/DoctorController";
import { AdminController } from "../controllers/AdminController";

import { loggerMiddleware } from "../middlewares/loggerMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { publicDoctorRoutes } from "./publicDoctorRoutes";
import { AppointmentController } from "@presentation/controllers/AppointmentController";
import { appointmentRoutes } from "./appointmentRoutes";

export function createRoutes(
  authController: AuthController,
  doctorController: DoctorController,
  adminController: AdminController,
  appointmentController:AppointmentController
) {
  const router = Router();

  router.use(loggerMiddleware);

  // PUBLIC
  router.use("/auth", authRoutes(authController));

  // // ADMIN — LOGIN ONLY (NO AUTH REQUIRED)
  // router.use("/admin/auth", adminAuthRoutes(adminController));

  // // ADMIN — PROTECTED ROUTES (pending, approve, reject, block, etc.)
  // router.use(
  //   "/admin",
  //   authMiddleware,
  //   allowRoles("ADMIN"),
  //   adminAuthRoutes(adminController) 
  // );
  // PUBLIC ADMIN ROUTES
router.use("/admin/auth", adminPublicRoutes(adminController));

// PROTECTED ADMIN ROUTES
router.use(
  "/admin",
  authMiddleware,
  allowRoles("ADMIN"),
  adminProtectedRoutes(adminController)
);


  // DOCTOR
  router.use(
    "/doctor",
    authMiddleware,
    allowRoles("DOCTOR"),
    doctorRoutes(doctorController)
  );
    router.get(
    "/verified",
    authMiddleware, 
    doctorController.getVerifiedDoctors
  );
  // PUBLIC / USER — DOCTORS
router.use(
  "/doctors",               //  PLURAL
  publicDoctorRoutes(doctorController)
);
router.use(
  "/",
  appointmentRoutes(appointmentController)
);


  router.use(errorMiddleware);


  return router;
}
