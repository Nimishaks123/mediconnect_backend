import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { ICreateAppointmentUseCase } from "@application/interfaces/appointment/ICreateAppointmentUseCase";
import { IConfirmAppointmentUseCase } from "@application/interfaces/appointment/IConfirmAppointmentUseCase";
import { StatusCode } from "@common/enums";

import { Response, Request } from "express";
import { IGetPatientAppointmentUseCase } from "@application/interfaces/appointment/IGetPatientAppointmentsUseCase";
import { GetPatientAppointmentsWithDoctor } from "@application/queries/GetPatientAppointmentsWithDoctor";
import { CancelAppointmentByPatientUseCase } from "@application/usecases/appointment/CancelAppointmentByPatientUseCase";
import { CreateCheckoutSessionUseCase } from "@application/usecases/appointment/CreateCheckoutSessionUseCase";
import { VerifyWebhookUseCase } from "@application/usecases/appointment/VerifyWebhookUseCase";
import { catchAsync } from "@presentation/utils/catchAsync";
import { AppointmentPresentationMapper } from "../mappers/appointment/AppointmentPresentationMapper";
import logger from "@common/logger";


export class AppointmentController {
  constructor(
    private readonly createAppointmentUC: ICreateAppointmentUseCase,
    private readonly confirmAppointmentUC: IConfirmAppointmentUseCase,
    private readonly getPatientAppointmentsUC: IGetPatientAppointmentUseCase,
    private readonly getPatientAppointmentsWithDoctor: GetPatientAppointmentsWithDoctor,
    private readonly cancelAppointmentByPatientUC: CancelAppointmentByPatientUseCase,
    private readonly createCheckoutSessionUC: CreateCheckoutSessionUseCase,
    private readonly verifyWebhookUC: VerifyWebhookUseCase
  ) { }

  /**
   * PATIENT → Create appointment
   */
  create = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const dto = AppointmentPresentationMapper.toCreateAppointmentDTO(req);
    const appointment = await this.createAppointmentUC.execute(dto);

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
    const dto = AppointmentPresentationMapper.toConfirmAppointmentDTO(req);
    await this.confirmAppointmentUC.execute(dto);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Appointment confirmed",
    });
  });

  /**
   * STRIPE WEBHOOK
   */
  stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    let event;
    try {
      const sig = req.headers["stripe-signature"] as string;
      event = this.verifyWebhookUC.execute(req.body, sig);
    } catch (err: any) {
      logger.error(` Webhook Signature Error: ${err.message}`);
      return res.status(StatusCode.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
    logger.info(`Received Stripe Event: ${event.type}`);

    // Stripe Checkout
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const appointmentId = session.metadata?.appointmentId;
      if (appointmentId) {
        logger.info(`Processing checkout.session.completed for Appointment: ${appointmentId}`);
        await this.confirmAppointmentUC.execute({ appointmentId });
      }
    }

    // Handle payment intent succeeded 
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as any;
      const appointmentId = intent.metadata?.appointmentId;
      if (appointmentId) {
        logger.info(`Processing payment_intent.succeeded for Appointment: ${appointmentId}`);
        await this.confirmAppointmentUC.execute({ appointmentId });
      }
    }

    res.json({ received: true });
  });

  /**
   * PATIENT → Cancel appointment and get refund 
   */
  cancelByPatient = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const dto = AppointmentPresentationMapper.toCancelByPatientDTO(req);
    const { refundAmount } = await this.cancelAppointmentByPatientUC.execute(dto);

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
    const dto = AppointmentPresentationMapper.toCreateCheckoutSessionDTO(req);
    const session = await this.createCheckoutSessionUC.execute(dto);

    res.status(StatusCode.OK).json({
      checkoutUrl: session.url,
    });
  });

  /**
   * GET APPOINTMENTS
   */
  getMyAppointments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const patientId = AppointmentPresentationMapper.toGetPatientAppointmentsDTO(req);
    const data = await this.getPatientAppointmentsWithDoctor.execute(patientId);
    res.status(StatusCode.OK).json({ success: true, data });
  });
}
