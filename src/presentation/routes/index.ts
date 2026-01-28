import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { doctorScheduleRoutes } from "./doctorScheduleRoutes";
import { doctorSlotRoutes } from "./doctorSlotRoutes";

import { AuthController } from "../controllers/AuthController";
import { DoctorController } from "../controllers/DoctorController";
import { AdminController } from "../controllers/AdminController";
import { DoctorScheduleController } from "../controllers/DoctorScheduleController";
import { DoctorSlotController } from "../controllers/DoctorSlotController";

import { doctorRoutes } from "./doctorRoutes";
import { adminPublicRoutes } from "./adminPublicRoutes";
import { adminProtectedRoutes } from "./adminProtectedRoutes";
import { loggerMiddleware } from "../middlewares/loggerMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { publicDoctorRoutes } from "./publicDoctorRoutes";
import { patientSlotRoutes } from "./patientSlotRoutes";

export function createRoutes(
  authController: AuthController,
  doctorController: DoctorController,
  adminController: AdminController,
  doctorScheduleController: DoctorScheduleController,
  doctorSlotController: DoctorSlotController
) {
  const router = Router();

  router.use(loggerMiddleware);

  router.use("/auth", authRoutes(authController));

  router.use("/admin/auth", adminPublicRoutes(adminController));

  router.use(
    "/admin",
    authMiddleware,
    allowRoles("ADMIN"),
    adminProtectedRoutes(adminController)
  );

  router.use(
    "/doctor",
    authMiddleware,
    allowRoles("DOCTOR"),
    doctorRoutes(doctorController)
  );

  router.use(
    "/doctors",
    publicDoctorRoutes(doctorController)
  );

  router.use(
    "/doctor/schedules",
    doctorScheduleRoutes(doctorScheduleController)
  );

  // Doctor slots
router.use(
  "/doctor/schedules",
  doctorSlotRoutes(doctorSlotController)
);

// Patient slots
// router.use(
//   "/patient",
//   patientSlotRoutes(doctorSlotController)
// );
router.use(
  "/patient",
  authMiddleware,          // 🔥 REQUIRED
  patientSlotRoutes(doctorSlotController)
);



  router.use(errorMiddleware);

  return router;
}
