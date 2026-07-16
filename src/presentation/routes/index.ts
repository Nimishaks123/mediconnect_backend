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
import { AdminAppointmentController } from "../controllers/AdminAppointmentController";
import { AdminWalletController } from "../controllers/AdminWalletController";
import { DoctorAppointmentController } from "../controllers/DoctorAppointmentController";
import { PatientWalletController } from "../controllers/PatientWalletController";
import { PatientController } from "../controllers/PatientController";
import { ReviewController } from "../controllers/ReviewController";
import { AdminDashboardController } from "@presentation/controllers/AdminDashboardController";
import { doctorRoutes } from "./doctorRoutes";
import { prescriptionRoutes } from "./prescriptionRoutes";
import { adminPublicRoutes } from "./adminPublicRoutes";
import { adminProtectedRoutes } from "./adminProtectedRoutes";
//import {loggerMiddleware } from "../middlewares/loggerMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { publicDoctorRoutes } from "./publicDoctorRoutes";
import { patientSlotRoutes } from "./patientSlotRoutes";
import { appointmentRoutes } from "./appointmentRoutes";
import { doctorAppointmentRoutes } from "./doctorAppointmentRoutes";
import { patientAppointmentRoutes } from "./patientAppointmentRoutes";
import { patientWalletRoutes } from "./patientWalletRoutes";
import { adminAppointmentRoutes } from "./adminAppointmentRoutes";
import { adminWalletRoutes } from "./adminWalletRoutes";
import { patientRoutes } from "./patientRoutes";
import { NotificationController } from "../controllers/NotificationController";
import { notificationRoutes } from "./notificationRoutes";
import { chatRoutes } from "./chatRoutes";
import { ChatController } from "../controllers/ChatController";
import { callRoutes } from "./callRoutes";
import { reviewRoutes } from "./reviewRoutes";
import { doctorWalletRoutes } from "./doctorWalletRoutes";
import { CallController } from "../controllers/CallController";
import { PrescriptionController } from "../controllers/PrescriptionController";
import { DoctorWalletController } from "../controllers/DoctorWalletController";
import { ITokenService } from "@application/interfaces/auth/ITokenService";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { userRepository } from "@di";
import { PlatformSettingsController } from "@presentation/controllers/PlatformSettingsController";
import { adminSettingsRoutes } from "./adminSettingsRoutes";
import { PlatformWalletController } from "../controllers/PlatformWalletController";
import { platformWalletRoutes } from "./platformWalletRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
export function createRoutes(
  authController: AuthController,
  doctorController: DoctorController,
  adminController: AdminController,
  adminDashboardController: AdminDashboardController,
  adminAppointmentController: AdminAppointmentController,
  doctorScheduleController: DoctorScheduleController,
  doctorSlotController: DoctorSlotController,
  appointmentController: AppointmentController,
  doctorAppointmentController: DoctorAppointmentController,
  patientWalletController: PatientWalletController,
  doctorWalletController: DoctorWalletController,
  patientController: PatientController,
  uploadController: UploadController,
  adminWalletController: AdminWalletController,
  platformSettingsController: PlatformSettingsController,
  platformWalletController: PlatformWalletController,
  notificationController: NotificationController,
  chatController: ChatController,
  callController: CallController,
    prescriptionController: PrescriptionController,
  reviewController: ReviewController,
  tokenService: ITokenService
) {
  const router = Router();
  const auth = createAuthMiddleware(tokenService,userRepository);

  // --- PUBLIC ROUTES ---
  router.use("/auth", authRoutes(authController, auth));

  router.use("/admin/auth", adminPublicRoutes(adminController));
  router.use("/doctors", publicDoctorRoutes(doctorController, auth)); // Some doctor routes are public

  // --- PROTECTED ROUTES (JWT REQUIRED) ---
  router.use("/upload", auth, uploadRoutes(uploadController, auth));
  router.use("/notifications", auth, notificationRoutes(notificationController, auth));
  router.use("/chat", auth, chatRoutes(chatController, auth));
  router.use("/call", auth, callRoutes(callController, auth));

  // Role-specific routers handle their own auth/role checks internally now
  router.use("/admin", adminProtectedRoutes(adminController, auth));
  router.use("/admin/appointments", adminAppointmentRoutes(adminAppointmentController, auth));
  router.use("/admin/wallets", adminWalletRoutes(adminWalletController, auth));
router.use(
  "/admin",
  adminSettingsRoutes(
    platformSettingsController,
    auth
  )
);
router.use(
  "/admin",
  platformWalletRoutes(
    platformWalletController,
    auth
  )
);
router.use(
  "/admin",
  dashboardRoutes(
    adminDashboardController,
    auth
  )
);

  router.use("/doctor", doctorRoutes(doctorController, auth));
  router.use("/doctor/appointments", doctorAppointmentRoutes(doctorAppointmentController, auth));
  router.use(
  "/doctor",
  doctorWalletRoutes(
    doctorWalletController,
    auth
  )
);
  router.use(
  "/prescriptions",
  prescriptionRoutes(
    prescriptionController,
    auth
  )
);
  router.use("/doctor/schedules", doctorScheduleRoutes(doctorScheduleController, auth));
  router.use("/doctor/schedules", doctorSlotRoutes(doctorSlotController, auth));

  router.use("/patient", patientRoutes(patientController, auth));
  router.use("/patient", patientSlotRoutes(doctorSlotController, auth));
  router.use("/patient", patientAppointmentRoutes(appointmentController, auth));
  router.use("/patient", patientWalletRoutes(patientWalletController, auth));
router.use(
  "/reviews",
  reviewRoutes(reviewController, auth)
);
  router.use("/appointments", auth, appointmentRoutes(appointmentController, auth));


  router.use(errorMiddleware);

  return router;
}
