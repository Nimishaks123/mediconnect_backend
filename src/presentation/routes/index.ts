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
import { chatRoutes } from "./chatRoutes";
import { ChatController } from "../controllers/ChatController";
import { callRoutes } from "./callRoutes";
import { CallController } from "../controllers/CallController";
import { ITokenService } from "@application/interfaces/auth/ITokenService";
import { createAuthMiddleware } from "../middlewares/authMiddleware";

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
  notificationController: NotificationController,
  chatController: ChatController,
  callController: CallController,
  tokenService: ITokenService
) {
  const router = Router();
  const auth = createAuthMiddleware(tokenService);

  router.use(loggerMiddleware);

  router.use("/auth", authRoutes(authController));
  router.use("/admin/auth", adminPublicRoutes(adminController));
  router.use("/upload", uploadRoutes(uploadController, auth));
  router.use("/notifications", notificationRoutes(notificationController, auth));
  router.use("/chat", chatRoutes(chatController, auth));
  router.use("/call", callRoutes(callController, auth));

  router.use(
    "/admin",
    auth,
    allowRoles(UserRole.ADMIN),
    adminProtectedRoutes(adminController, auth)
  );

  router.use(
    "/admin/appointments",
    auth,
    allowRoles(UserRole.ADMIN),
    adminAppointmentRoutes(adminAppointmentController, tokenService)
  );

  router.use(
    "/admin/wallets",
    auth,
    allowRoles(UserRole.ADMIN),
    adminWalletRoutes(adminWalletController, auth)
  );

  router.use(
    "/doctor",
    auth,
    allowRoles(UserRole.DOCTOR),
    doctorRoutes(doctorController, auth)
  );

  router.use(
    "/doctor/appointments",
    auth,
    allowRoles(UserRole.DOCTOR),
    doctorAppointmentRoutes(doctorAppointmentController, auth)
  );

  router.use("/doctors", publicDoctorRoutes(doctorController, auth));

  router.use(
    "/doctor/schedules",
    doctorScheduleRoutes(doctorScheduleController, auth)
  );

  router.use(
    "/doctor/schedules",
    doctorSlotRoutes(doctorSlotController, auth)
  );

  router.use(
    "/patient",
    auth,
    allowRoles(UserRole.PATIENT),
    patientRoutes(patientController, auth)
  );

  router.use(
    "/patient",
    auth,          
    patientSlotRoutes(doctorSlotController)
  );

  router.use(
    "/patient",
    auth,          
    patientAppointmentRoutes(appointmentController, auth)
  );

  router.use(
    "/patient",
    auth,
    allowRoles(UserRole.PATIENT),
    patientWalletRoutes(patientWalletController, auth)
  );

  router.use(
    "/appointments",
    auth,
    appointmentRoutes(appointmentController, auth)
  );

  router.use(errorMiddleware);

  return router;
}
