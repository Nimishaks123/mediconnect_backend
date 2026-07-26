import { 
  CreateAppointmentUseCase, 
  CancelAppointmentUseCase, 
  ConfirmAppointmentUseCase, 
  GetPatientAppointmentUseCase,
  GetDoctorAppointmentsUseCase,
  RescheduleAppointmentUseCase,
  CancelAppointmentByPatientUseCase,
  CreateCheckoutSessionUseCase,
  VerifyWebhookUseCase,
  HandleStripeWebhookUseCase,
  PayAppointmentWithWalletUseCase,
  AutoCompleteAppointmentsUseCase,
  StartConsultationSessionUseCase,
  CompleteConsultationSessionUseCase
} from "@application/usecases/appointment";
import { creditPlatformWalletUseCase }
from "./platformWalletUseCases";
import { 
  appointmentRepository, 
  doctorRepository,
  userRepository,
  appointmentQueryRepo,
  doctorScheduleRepository,
  walletRepository,
  platformSettingsRepository
} from "./repositories";
import { eventBus, rrulePolicy, paymentService } from "./services";
import { createNotificationUseCase } from "./notificationUsecases";
import {
  ProcessWalletTopupWebhookUseCase
} from "@application/usecases/wallet/ProcessWalletTopupWebhookUseCase";

import {
  walletTransactionRepository
} from "./repositories";
import { creditDoctorEarningsUseCase } from "./walletUsecases";

export const createAppointmentUseCase =
  new CreateAppointmentUseCase(
    appointmentRepository,
    doctorRepository,
    createNotificationUseCase
  );

export const cancelAppointmentUseCase =
  new CancelAppointmentUseCase(
    appointmentRepository,
    eventBus,
    createNotificationUseCase,
    doctorRepository,
    userRepository,
    walletRepository
  );

export const confirmAppointmentUseCase =
  new ConfirmAppointmentUseCase(
    appointmentRepository,
    doctorRepository,
    userRepository,
    eventBus,
    createNotificationUseCase
  );

export const startConsultationSessionUseCase =
  new StartConsultationSessionUseCase(
    appointmentRepository
  );

export const completeConsultationSessionUseCase =
  new CompleteConsultationSessionUseCase(
    appointmentRepository,
    creditDoctorEarningsUseCase,
    creditPlatformWalletUseCase
  );

export const autoCompleteAppointmentsUseCase =
  new AutoCompleteAppointmentsUseCase(
    appointmentRepository,
    completeConsultationSessionUseCase
  );

export const getPatientAppointmentUseCase =
  new GetPatientAppointmentUseCase(
    appointmentQueryRepo,
    autoCompleteAppointmentsUseCase
  );

export const getDoctorAppointmentsUseCase = 
  new GetDoctorAppointmentsUseCase(
    appointmentRepository,
    doctorRepository,
    autoCompleteAppointmentsUseCase
  );

export const rescheduleAppointmentUseCase = 
  new RescheduleAppointmentUseCase(
    appointmentRepository,
    doctorScheduleRepository,
    eventBus,
    rrulePolicy,
    createNotificationUseCase,
    doctorRepository,
    userRepository
  );

export const cancelAppointmentByPatientUseCase = 
  new CancelAppointmentByPatientUseCase(
    appointmentRepository,
    eventBus,
    createNotificationUseCase,
    doctorRepository,
    userRepository,
    platformSettingsRepository
  );

export const createCheckoutSessionUseCase = 
  new CreateCheckoutSessionUseCase(
    appointmentRepository,
    paymentService
  );

export const verifyWebhookUseCase =
  new VerifyWebhookUseCase(
    paymentService
  );
  export const processWalletTopupWebhookUseCase =
  new ProcessWalletTopupWebhookUseCase(
    walletRepository,
    walletTransactionRepository
  );

export const handleStripeWebhookUseCase =
  new HandleStripeWebhookUseCase(
    confirmAppointmentUseCase,
    processWalletTopupWebhookUseCase
  );
  export const payAppointmentWithWalletUseCase=new PayAppointmentWithWalletUseCase(
    appointmentRepository,
    walletRepository,
    createNotificationUseCase
  );