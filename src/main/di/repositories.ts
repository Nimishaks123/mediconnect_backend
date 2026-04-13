// src/di/repositories.ts

import { UserRepository } from "@infrastructure/persistence/UserRepository";
import { DoctorRepository } from "@infrastructure/persistence/DoctorRepository";
import { AdminRepository } from "@infrastructure/persistence/AdminRepository";
import { OtpRepository } from "@infrastructure/persistence/OtpRepository";
import { DoctorScheduleRepository } from "@infrastructure/persistence/DoctorScheduleRepository";
import { AppointmentRepository } from "@infrastructure/persistence/AppointmentRepository";
import { AppointmentQueryRepository } from "@infrastructure/persistence/AppointmentQueryRepository";
import { WalletRepositoryImpl } from "@infrastructure/repositories/WalletRepositoryImpl";
import { PatientRepository } from "@infrastructure/persistence/PatientRepository";
import { AdminDoctorQueryRepository } from "@infrastructure/persistence/AdminDoctorQueryRepository";
import { UserQueryRepository } from "@infrastructure/persistence/UserQueryRepository";
import { WalletQueryRepository } from "@infrastructure/persistence/WalletQueryRepository";

import { NotificationRepository } from "@infrastructure/persistence/NotificationRepository";

export const userRepository = new UserRepository();
export const patientRepository = new PatientRepository();
export const doctorRepository = new DoctorRepository();
export const adminRepository = new AdminRepository();
export const otpRepository = new OtpRepository();
export const doctorScheduleRepository = new DoctorScheduleRepository();
export const appointmentRepository = new AppointmentRepository();
export const walletRepository = new WalletRepositoryImpl();
export const notificationRepository = new NotificationRepository();

export const appointmentQueryRepo = new AppointmentQueryRepository();
export const adminDoctorQueryRepo = new AdminDoctorQueryRepository();
export const userQueryRepo = new UserQueryRepository();
export const walletQueryRepo = new WalletQueryRepository();