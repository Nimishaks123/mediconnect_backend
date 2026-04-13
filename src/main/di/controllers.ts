// src/di/controllers.ts

import { AuthController } from "@presentation/controllers/AuthController";
import { DoctorController } from "@presentation/controllers/DoctorController";
import { AdminController } from "@presentation/controllers/AdminController";
import { DoctorScheduleController } from "@presentation/controllers/DoctorScheduleController";
import { DoctorSlotController } from "@presentation/controllers/DoctorSlotController";
import { AppointmentController } from "@presentation/controllers/AppointmentController";
import { DoctorAppointmentController } from "@presentation/controllers/DoctorAppointmentController";
import { PatientWalletController } from "@presentation/controllers/PatientWalletController";
import { GetUserWalletUseCase } from "@application/usecases/wallet/GetUserWalletUseCase";
import {  tokenService,  passwordHasher, eventBus, notificationService } from "./services";
import * as authUC from "./authUsecases";
import * as doctorUC from "./doctorUsecases";
import * as scheduleUC from "./scheduleUsecases";
import * as appointmentUC from "./appointmentUsecases";
import * as patientUC from "./patientUsecases";
import * as notificationUC from "./notificationUsecases";
import { PatientController } from "@presentation/controllers/PatientController";
import { 
  adminRepository,
  userRepository,
  doctorRepository,
  appointmentQueryRepo, 
  walletRepository,
  adminDoctorQueryRepo,
  userQueryRepo,
  walletQueryRepo
} from "./repositories";

import { GetPatientAppointmentsWithDoctor } from "@application/queries/GetPatientAppointmentsWithDoctor";

import {
  AdminLoginUseCase,
  GetAdminDoctorsUseCase,
  ApproveDoctorUseCase,
  RejectDoctorUseCase,
  BlockUnblockUserUseCase,
  GetAllUsersUseCase,
  GetAdminAppointmentsUseCase,
  GetAdminAppointmentDetailsUseCase,
  GetAdminWalletsUseCase,
  GetAdminWalletTransactionsUseCase
} from "@application/usecases/admin";
import { GetPatientAppointmentUseCase } from "@application/usecases/appointment/GetPatientAppointmentUseCase";
import { AdminAppointmentController } from "@presentation/controllers/AdminAppointmentController";
import { AdminWalletController } from "@presentation/controllers/AdminWalletController";

// ADMIN use cases
const adminLoginUseCase = new AdminLoginUseCase(adminRepository, tokenService, passwordHasher);

const getAdminDoctorsUseCase = new GetAdminDoctorsUseCase(adminDoctorQueryRepo);
const approveDoctorUseCase = new ApproveDoctorUseCase(doctorRepository, eventBus, notificationUC.createNotificationUseCase);
const rejectDoctorUseCase = new RejectDoctorUseCase(doctorRepository, eventBus, notificationUC.createNotificationUseCase);

const getPatientAppointmentsWithDoctor = new GetPatientAppointmentsWithDoctor(appointmentQueryRepo);

const blockUnblockUserUseCase = new BlockUnblockUserUseCase(userRepository);

// Optimized Admin Appointment Query
const getAdminAppointmentsUseCase = new GetAdminAppointmentsUseCase(appointmentQueryRepo);
const getAdminAppointmentDetailsUseCase = new GetAdminAppointmentDetailsUseCase(appointmentQueryRepo);

// Optimized Admin Wallet Query
const getAdminWalletsUseCase = new GetAdminWalletsUseCase(walletQueryRepo);
const getAdminWalletTransactionsUseCase = new GetAdminWalletTransactionsUseCase(walletQueryRepo);

// Optimized Patient Appointment Query 
const getPatientAppointmentsUseCase = new GetPatientAppointmentUseCase(appointmentQueryRepo);

const getAllUsersUseCase = new GetAllUsersUseCase(userQueryRepo);

// WALLET
const getUserWalletUseCase = new GetUserWalletUseCase(walletRepository);

import { NotificationController } from "@presentation/controllers/NotificationController";

// CONTROLLERS
export const notificationController = new NotificationController(
  notificationUC.getUserNotificationsUseCase,
  notificationUC.markNotificationAsReadUseCase
);

export const authController = new AuthController(
  authUC.signupUserUseCase,
  authUC.verifyOtpUseCase,
  authUC.resendOtpUseCase,
  authUC.loginUseCase,
  authUC.refreshTokenUseCase,
  authUC.sendForgotPasswordOtpUseCase,
  authUC.verifyForgotPasswordOtpUseCase,
  authUC.resetPasswordUseCase,
  authUC.loginWithGoogleUseCase
);

export const doctorController = new DoctorController(
  doctorUC.startDoctorOnboardingUseCase,
  doctorUC.createDoctorProfileUseCase,
  doctorUC.updateDoctorProfileUseCase,
  doctorUC.uploadDoctorDocumentsUseCase,
  doctorUC.submitForVerificationUseCase,
  doctorUC.getDoctorProfileUseCase,
  doctorUC.getVerifiedDoctorsUseCase
);

export const adminController = new AdminController(
  adminLoginUseCase,
  getAdminDoctorsUseCase,
  approveDoctorUseCase,
  rejectDoctorUseCase,
  blockUnblockUserUseCase,
  getAllUsersUseCase
);

export const adminAppointmentController = new AdminAppointmentController(
  getAdminAppointmentsUseCase,
  getAdminAppointmentDetailsUseCase
);

export const adminWalletController = new AdminWalletController(
  getAdminWalletsUseCase,
  getAdminWalletTransactionsUseCase
);

export const doctorScheduleController = new DoctorScheduleController(
  scheduleUC.createDoctorScheduleUseCase,
  scheduleUC.getDoctorSlotsWithBookingUseCase
);

export const doctorSlotController = new DoctorSlotController(
  scheduleUC.generateDoctorSlotsUseCase,
  scheduleUC.deleteDoctorSlotUseCase
);

export const doctorAppointmentController = new DoctorAppointmentController(
  appointmentUC.getDoctorAppointmentsUseCase,
  appointmentUC.rescheduleAppointmentUseCase,
  appointmentUC.cancelAppointmentUseCase,
  doctorRepository
);

export const appointmentController = new AppointmentController(
  appointmentUC.createAppointmentUseCase,
  appointmentUC.confirmAppointmentUseCase,
  getPatientAppointmentsUseCase,
  getPatientAppointmentsWithDoctor,
  appointmentUC.cancelAppointmentByPatientUseCase,
  appointmentUC.createCheckoutSessionUseCase,
  appointmentUC.verifyWebhookUseCase
);

export const patientController = new PatientController(
  patientUC.createPatientProfileUseCase,
  patientUC.getPatientProfileUseCase,
  patientUC.updatePatientProfileUseCase
);

import { UploadController } from "@presentation/controllers/UploadController";
import { GetCloudinarySignatureUseCase } from "@application/usecases/upload/GetCloudinarySignatureUseCase";
import { fileStorageService } from "./services";

// UPLOAD
const getCloudinarySignatureUseCase = new GetCloudinarySignatureUseCase(fileStorageService);
export const uploadController = new UploadController(getCloudinarySignatureUseCase);

export const patientWalletController = new PatientWalletController(getUserWalletUseCase);