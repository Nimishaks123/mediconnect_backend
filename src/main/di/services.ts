import { InMemoryEventBus } from "@infrastructure/events/InMemoryEventBus";
import { SendAppointmentConfirmationEmailHandler } from "@application/events/handlers/SendAppointmentConfirmationEmailHandler";
import { SendAppointmentCancellationEmailHandler } from "@application/events/handlers/SendAppointmentCancellationEmailHandler";
import { SendPatientCancellationEmailHandler } from "@application/events/handlers/SendPatientCancellationEmailHandler";
import { WalletRefundHandler } from "@application/events/handlers/WalletRefundHandler";
import { SendAppointmentRescheduledEmailHandler } from "@application/events/handlers/SendAppointmentRescheduledEmailHandler";
import { SendDoctorApprovedNotificationHandler } from "@application/events/handlers/SendDoctorApprovedNotificationHandler";
import { SendDoctorRejectedNotificationHandler } from "@application/events/handlers/SendDoctorRejectedNotificationHandler";
import { AppointmentConfirmedEvent } from "@domain/events/AppointmentConfirmedEvent";
import { CancelAppointmentEvent } from "@domain/events/CancelAppointmentEvent";
import { PatientCancelledAppointmentEvent } from "@domain/events/PatientCancelledAppointmentEvent";
import { AppointmentRescheduledEvent } from "@domain/events/AppointmentRescheduledEvent";
import { DoctorApprovedEvent } from "@domain/events/DoctorApprovedEvent";
import { DoctorRejectedEvent } from "@domain/events/DoctorRejectedEvent";
import { OtpResentEvent } from "@domain/events/OtpResentEvent";
import { ForgotPasswordOtpSentEvent } from "@domain/events/ForgotPasswordOtpSentEvent";
import { UserSignedUpEvent } from "@domain/events/UserSignedUpEvent";
import { SendOtpEmailHandler } from "@application/events/handlers/SendOtpEmailHandler";
import { SendForgotPasswordEmailHandler } from "@application/events/handlers/SendForgotPasswordEmailHandler";
import { SendWelcomeOtpEmailHandler } from "@application/events/handlers/SendWelcomeOtpEmailHandler";
import { userRepository, doctorRepository, walletRepository } from "./repositories";
import { JwtTokenService } from "@infrastructure/services/JwtTokenService";
import { NodemailerMailer } from "@infrastructure/mailer/NodemailerMailer";
import { CloudinaryService } from "@infrastructure/services/CloudinaryService";
import { GoogleOAuthService } from "@infrastructure/services/GoogleOAuthService";
import { RRulePolicy } from "@infrastructure/services/RRulePolicy";
import { config } from "@common/config";
import { StripePaymentService } from "@infrastructure/services/StripePaymentService";
import { EmailService } from "@infrastructure/services/EmailService";
import { WalletService } from "@application/services/WalletService";
import { BcryptHasher } from "@infrastructure/services/BcryptHasher";
import { CryptoRandomGenerator } from "@infrastructure/services/CryptoRandomGenerator";
import { OtpGenerator } from "@infrastructure/services/OtpGenerator";
import { SocketNotificationService } from "@infrastructure/services/SocketNotificationService";
import { DoctorDocumentService } from "@application/services/DoctorDocumentService";

// Event Bus & Handlers
export const eventBus = new InMemoryEventBus();

export const notificationService = new SocketNotificationService();

export const passwordHasher = new BcryptHasher();
export const randomGenerator = new CryptoRandomGenerator();
export const otpGenerator = new OtpGenerator();
export const paymentService = new StripePaymentService();

export const tokenService = new JwtTokenService(
  config.accessTokenSecret,
  config.accessTokenExpiry,
  config.refreshTokenSecret,
  config.refreshTokenExpiry
);
export const mailer = new NodemailerMailer(
  config.mailHost,
  config.mailPort,
  config.mailUser,
  config.mailPass,
  config.mailFrom
);
export const emailService = new EmailService();
export const fileStorageService = new CloudinaryService();
export const doctorDocumentService = new DoctorDocumentService(fileStorageService);
export const oauthService = new GoogleOAuthService();
export const rrulePolicy = new RRulePolicy();
export const walletService = new WalletService(walletRepository);
const sendAppointmentConfirmationEmailHandler = new SendAppointmentConfirmationEmailHandler(
  userRepository,
  doctorRepository,
  emailService
);

const sendAppointmentCancellationEmailHandler = new SendAppointmentCancellationEmailHandler(
  userRepository,
  doctorRepository,
  emailService
);

const walletRefundHandler = new WalletRefundHandler(walletService);

const sendPatientCancellationEmailHandler = new SendPatientCancellationEmailHandler(
  userRepository,
  doctorRepository,
  emailService
);

export const sendAppointmentRescheduledEmailHandler = new SendAppointmentRescheduledEmailHandler(
  userRepository,
  doctorRepository,
  emailService
);

const sendDoctorApprovedNotificationHandler = new SendDoctorApprovedNotificationHandler(
  userRepository,
  mailer
);

const sendDoctorRejectedNotificationHandler = new SendDoctorRejectedNotificationHandler(
  userRepository,
  mailer
);

const sendOtpEmailHandler = new SendOtpEmailHandler(mailer);
const sendForgotPasswordEmailHandler = new SendForgotPasswordEmailHandler(mailer);
const sendWelcomeOtpEmailHandler = new SendWelcomeOtpEmailHandler(mailer);

// Subscribe Handlers
eventBus.subscribe(AppointmentConfirmedEvent.name, (event: AppointmentConfirmedEvent) => sendAppointmentConfirmationEmailHandler.handle(event));
eventBus.subscribe(CancelAppointmentEvent.name, (event: CancelAppointmentEvent) => sendAppointmentCancellationEmailHandler.handle(event));
eventBus.subscribe(PatientCancelledAppointmentEvent.name, async (event: PatientCancelledAppointmentEvent) => {
  await walletRefundHandler.handle(event);
  await sendPatientCancellationEmailHandler.handle(event);
});
eventBus.subscribe(AppointmentRescheduledEvent.name, (event: AppointmentRescheduledEvent) => sendAppointmentRescheduledEmailHandler.handle(event));
eventBus.subscribe(DoctorApprovedEvent.name, (event: DoctorApprovedEvent) => sendDoctorApprovedNotificationHandler.handle(event));
eventBus.subscribe(DoctorRejectedEvent.name, (event: DoctorRejectedEvent) => sendDoctorRejectedNotificationHandler.handle(event));
eventBus.subscribe(ForgotPasswordOtpSentEvent.name, (event: ForgotPasswordOtpSentEvent) => sendForgotPasswordEmailHandler.handle(event));
eventBus.subscribe(UserSignedUpEvent.name, (event: UserSignedUpEvent) => sendWelcomeOtpEmailHandler.handle(event));
eventBus.subscribe(OtpResentEvent.name, (event: OtpResentEvent) =>
  sendOtpEmailHandler.handle(event)
);