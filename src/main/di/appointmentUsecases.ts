import { 
  CreateAppointmentUseCase, 
  CancelAppointmentUseCase, 
  ConfirmAppointmentUseCase, 
  GetPatientAppointmentUseCase,
  GetDoctorAppointmentsUseCase,
  RescheduleAppointmentUseCase,
  CancelAppointmentByPatientUseCase,
  CreateCheckoutSessionUseCase,
  VerifyWebhookUseCase
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
    eventBus
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
    appointmentRepository
  );

export const rescheduleAppointmentUseCase = 
  new RescheduleAppointmentUseCase(
    appointmentRepository,
    doctorScheduleRepository,
    eventBus,
    rrulePolicy
  );

export const cancelAppointmentByPatientUseCase = 
  new CancelAppointmentByPatientUseCase(
    appointmentRepository,
    eventBus
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