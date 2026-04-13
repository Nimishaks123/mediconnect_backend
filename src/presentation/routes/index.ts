import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { uploadRoutes } from "./uploadRoutes";
import { UploadController } from "../controllers/UploadController";
import { doctorScheduleRoutes } from "./doctorScheduleRoutes";
import { doctorSlotRoutes } from "./doctorSlotRoutes";
import { AuthController } from "../controllers/AuthController";
import { DoctorController } from "../controllers/DoctorController";
import { AdminController } from "../controllers/AdminController";
import { DoctorScheduleController } from "../controllers/DoctorScheduleController";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { AppointmentController } from "@presentation/controllers/AppointmentController";
import { doctorRoutes } from "./doctorRoutes";
import { adminPublicRoutes } from "./adminPublicRoutes";
import { adminProtectedRoutes } from "./adminProtectedRoutes";
import { loggerMiddleware } from "../middlewares/loggerMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { publicDoctorRoutes } from "./publicDoctorRoutes";
import { patientSlotRoutes } from "./patientSlotRoutes";
import { appointmentRoutes } from "./appointmentRoutes";
import { doctorAppointmentRoutes } from "./doctorAppointmentRoutes";
import { DoctorAppointmentController } from "../controllers/DoctorAppointmentController";
import { PatientWalletController } from "../controllers/PatientWalletController";
import { patientAppointmentRoutes } from "./patientAppointmentRoutes";
import { patientWalletRoutes } from "./patientWalletRoutes";
import { AdminAppointmentController } from "../controllers/AdminAppointmentController";
import { adminAppointmentRoutes } from "./adminAppointmentRoutes";
import { AdminWalletController } from "../controllers/AdminWalletController";
import { adminWalletRoutes } from "./adminWalletRoutes";
import { PatientController } from "../controllers/PatientController";
import { patientRoutes } from "./patientRoutes";

import { NotificationController } from "../controllers/NotificationController";
import { notificationRoutes } from "./notificationRoutes";

export function createRoutes(
  authController: AuthController,
  doctorController: DoctorController,
  adminController: AdminController,
  adminAppointmentController: AdminAppointmentController,
  doctorScheduleController: DoctorScheduleController,
  doctorSlotController: DoctorSlotController,
  appointmentController: AppointmentController,
  doctorAppointmentController: DoctorAppointmentController,
  patientWalletController: PatientWalletController,
  patientController: PatientController,
  uploadController: UploadController,
  adminWalletController: AdminWalletController,
  notificationController: NotificationController
) {
  const router = Router();

  router.use(loggerMiddleware);

  router.use("/auth", authRoutes(authController));
  router.use("/admin/auth", adminPublicRoutes(adminController));
  router.use("/upload", uploadRoutes(uploadController));
  router.use("/notifications", notificationRoutes(notificationController));

  router.use(
    "/admin",
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    adminProtectedRoutes(adminController)
  );

  router.use(
    "/admin/appointments",
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    adminAppointmentRoutes(adminAppointmentController)
  );

  router.use(
    "/admin/wallets",
    authMiddleware,
    allowRoles(UserRole.ADMIN),
    adminWalletRoutes(adminWalletController)
  );

  router.use(
    "/doctor",
    authMiddleware,
    allowRoles(UserRole.DOCTOR),
    doctorRoutes(doctorController)
  );

  router.use(
    "/doctor/appointments",
    authMiddleware,
    allowRoles(UserRole.DOCTOR),
    doctorAppointmentRoutes(doctorAppointmentController)
  );

  router.use("/doctors", publicDoctorRoutes(doctorController));

  router.use(
    "/doctor/schedules",
    doctorScheduleRoutes(doctorScheduleController)
  );

  router.use(
    "/doctor/schedules",
    doctorSlotRoutes(doctorSlotController)
  );

  router.use(
    "/patient",
    authMiddleware,
    allowRoles(UserRole.PATIENT),
    patientRoutes(patientController)
  );

  router.use(
    "/patient",
    authMiddleware,          
    patientSlotRoutes(doctorSlotController)
  );

  router.use(
    "/patient",
    authMiddleware,          
    patientAppointmentRoutes(appointmentController)
  );

  router.use(
    "/patient",
    authMiddleware,
    allowRoles(UserRole.PATIENT),
    patientWalletRoutes(patientWalletController)
  );

  router.use(
    "/appointments",
    authMiddleware,
    appointmentRoutes(appointmentController)
  );

  router.use(errorMiddleware);

  return router;
}
