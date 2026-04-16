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
  HandleStripeWebhookUseCase
} from "@application/usecases/appointment";
import { 
  appointmentRepository, 
  doctorRepository,
  userRepository,
  appointmentQueryRepo,
  doctorScheduleRepository,
} from "./repositories";
import { eventBus, rrulePolicy, paymentService } from "./services";
import { createNotificationUseCase } from "./notificationUsecases";

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
    userRepository
  );

export const confirmAppointmentUseCase =
  new ConfirmAppointmentUseCase(
    appointmentRepository,
    doctorRepository,
    userRepository,
    eventBus,
    createNotificationUseCase
  );

export const getPatientAppointmentUseCase =
  new GetPatientAppointmentUseCase(
    appointmentQueryRepo
  );

export const getDoctorAppointmentsUseCase = 
  new GetDoctorAppointmentsUseCase(
    appointmentRepository,
    doctorRepository
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
    userRepository
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

export const handleStripeWebhookUseCase =
  new HandleStripeWebhookUseCase(
    confirmAppointmentUseCase
  );