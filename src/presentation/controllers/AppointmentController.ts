import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { ICreateAppointmentUseCase } from "@application/interfaces/appointment/ICreateAppointmentUseCase";
import { IConfirmAppointmentUseCase } from "@application/interfaces/appointment/IConfirmAppointmentUseCase";
import { StatusCode } from "@common/enums";

import { Response, Request } from "express";
import { IGetPatientAppointmentUseCase } from "@application/interfaces/appointment/IGetPatientAppointmentsUseCase";
import { IGetPatientAppointmentsWithDoctor } from "@application/interfaces/queries/IGetPatientAppointmentsWithDoctor";
import { ICancelAppointmentByPatientUseCase } from "@application/interfaces/appointment/ICancelAppointmentByPatientUseCase";
import { ICreateCheckoutSessionUseCase } from "@application/interfaces/appointment/ICreateCheckoutSessionUseCase";
import { IVerifyWebhookUseCase } from "@application/interfaces/appointment/IVerifyWebhookUseCase";
import { IHandleStripeWebhookUseCase } from "@application/interfaces/appointment/IHandleStripeWebhookUseCase";
import { catchAsync } from "@presentation/utils/catchAsync";
import { 
  CreateAppointmentSchema,
  ConfirmAppointmentSchema,
  CancelByPatientSchema,
  CreateCheckoutSessionSchema,
  GetPatientAppointmentsSchema
} from "../validators/appointment.validator";


export class AppointmentController {
  constructor(
    private readonly createAppointmentUC: ICreateAppointmentUseCase,
    private readonly confirmAppointmentUC: IConfirmAppointmentUseCase,
    private readonly getPatientAppointmentsUC: IGetPatientAppointmentUseCase,
    private readonly getPatientAppointmentsWithDoctor: IGetPatientAppointmentsWithDoctor,
    private readonly cancelAppointmentByPatientUC: ICancelAppointmentByPatientUseCase,
    private readonly createCheckoutSessionUC: ICreateCheckoutSessionUseCase,
    private readonly verifyWebhookUC: IVerifyWebhookUseCase,
    private readonly handleStripeWebhookUC: IHandleStripeWebhookUseCase
  ) { }

  /**
   * PATIENT → Create appointment
   */
  create = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      res.status(StatusCode.UNAUTHORIZED).json({ error: "User not authenticated" });
      return;
    }
    
    const validated = CreateAppointmentSchema.parse({
      doctorId: req.body.doctorId,
      availabilityId: req.body.availabilityId,
      patientId: req.user.id,
    });
    const appointment = await this.createAppointmentUC.execute(validated);

    res.status(StatusCode.CREATED).json({
      success: true,
      appointmentId: appointment.id,
      status: appointment.status,
    });
  });

  /**
   * PAYMENT SUCCESS → Confirm appointment 
   */
  confirm = catchAsync(async (req: Request, res: Response) => {
    const validated = ConfirmAppointmentSchema.parse({
      appointmentId: req.params.id,
    });
    await this.confirmAppointmentUC.execute(validated);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Appointment confirmed",
    });
  });

  /**
   * STRIPE WEBHOOK
   */
  stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    if (!sig) {
      throw new Error("Invalid signature");
    }
    
    const event = await this.verifyWebhookUC.execute(req.body, sig);
    await this.handleStripeWebhookUC.execute(event);
    
    res.json({ received: true });
  });

  /**
   * PATIENT → Cancel appointment and get refund 
   */
  cancelByPatient = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      res.status(StatusCode.UNAUTHORIZED).json({ error: "User not authenticated" });
      return;
    }
    
    const validated = CancelByPatientSchema.parse({
      appointmentId: req.params.id,
      patientId: req.user.id,
    });
    const { refundAmount } = await this.cancelAppointmentByPatientUC.execute(validated);

    res.status(StatusCode.OK).json({
      success: true,
      message: refundAmount > 0
        ? `Appointment cancelled. ₹${refundAmount} has been refunded to your wallet.` 
        : "Appointment cancelled. No refund applicable as per cancellation policy.",
      refundAmount
    });
  });

  /**
   * CREATE STRIPE CHECKOUT SESSION
   */
  createCheckoutSession = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      res.status(StatusCode.UNAUTHORIZED).json({ error: "User not authenticated" });
      return;
    }
    
    const validated = CreateCheckoutSessionSchema.parse({
      appointmentId: req.params.id,
      patientId: req.user.id,
    });
    const session = await this.createCheckoutSessionUC.execute(validated);

    res.status(StatusCode.OK).json({
      checkoutUrl: session.url,
    });
  });

  /**
   * GET APPOINTMENTS
   */
  getMyAppointments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      res.status(StatusCode.UNAUTHORIZED).json({ error: "User not authenticated" });
      return;
    }
    
    const validated = GetPatientAppointmentsSchema.parse({
      patientId: req.user.id,
    });
    const data = await this.getPatientAppointmentsWithDoctor.execute(validated.patientId);
    res.status(StatusCode.OK).json({ success: true, data });
  });
}
