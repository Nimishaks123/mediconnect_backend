// import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
// import { ICreateAppointmentUseCase } from "@application/interfaces/appointment/ICreateAppointmentUseCase";
// import { IConfirmAppointmentUseCase } from "@application/interfaces/appointment/IConfirmAppointmentUseCase";
// import { StatusCode } from "@common/enums";

// import { Response, Request, NextFunction } from "express";

// import { IGetPatientAppointmentUseCase } from "@application/interfaces/appointment/IGetPatientAppointmentsUseCase";
// import { IGetPatientAppointmentsWithDoctor } from "@application/interfaces/queries/IGetPatientAppointmentsWithDoctor";
// import { ICancelAppointmentByPatientUseCase } from "@application/interfaces/appointment/ICancelAppointmentByPatientUseCase";
// import { ICreateCheckoutSessionUseCase } from "@application/interfaces/appointment/ICreateCheckoutSessionUseCase";
// import { IVerifyWebhookUseCase } from "@application/interfaces/appointment/IVerifyWebhookUseCase";
// import { IHandleStripeWebhookUseCase } from "@application/interfaces/appointment/IHandleStripeWebhookUseCase";
// import { catchAsync } from "@presentation/utils/catchAsync";
// import { ValidatedRequest } from "@presentation/types/ValidatedRequest";
// import { 
//   createAppointmentSchema,
//   paramIdSchema,
//   cancelByPatientSchema,
//   createCheckoutSessionSchema,
//   getMyAppointmentsSchema
// } from "@presentation/validation/appointmentValidation";


// export class AppointmentController {
//   constructor(
//     private readonly createAppointmentUC: ICreateAppointmentUseCase,
//     private readonly confirmAppointmentUC: IConfirmAppointmentUseCase,
//     private readonly getPatientAppointmentsUC: IGetPatientAppointmentUseCase,
//     private readonly getPatientAppointmentsWithDoctor: IGetPatientAppointmentsWithDoctor,
//     private readonly cancelAppointmentByPatientUC: ICancelAppointmentByPatientUseCase,
//     private readonly createCheckoutSessionUC: ICreateCheckoutSessionUseCase,
//     private readonly verifyWebhookUC: IVerifyWebhookUseCase,
//     private readonly handleStripeWebhookUC: IHandleStripeWebhookUseCase
//   ) { }

//   /**
//    * PATIENT → Create appointment
//    */
//   create = catchAsync(async (req: ValidatedRequest<typeof createAppointmentSchema>, res: Response, next: NextFunction) => {
//     console.log("Appointment Create Request Received");
//     console.log("-> doctorId:", req.body.doctorId);
//     console.log("-> slotId:", req.body.slotId);


//     const appointment = await this.createAppointmentUC.execute({
//       doctorId: req.body.doctorId,
//       slotId: req.body.slotId, // Changed from availabilityId
//       patientId: req.user!.id,
//     });

//     res.status(StatusCode.CREATED).json({
//       success: true,
//       appointmentId: appointment.id,
//       status: appointment.status,
//     });
//   });


//   /**
//    * PAYMENT SUCCESS → Confirm appointment 
//    */
//   confirm = catchAsync(async (req: ValidatedRequest<typeof paramIdSchema>, res: Response, next: NextFunction) => {
//     await this.confirmAppointmentUC.execute({
//       appointmentId: req.params.id,
//     });

//     res.status(StatusCode.OK).json({
//       success: true,
//       message: "Appointment confirmed",
//     });
//   });

//   /**
//    * STRIPE WEBHOOK
//    */
//   stripeWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const sig = req.headers["stripe-signature"] as string;
//     if (!sig) {
//       throw new Error("Invalid signature");
//     }

//     const event = await this.verifyWebhookUC.execute(req.body, sig);
//     await this.handleStripeWebhookUC.execute(event);

//     res.json({ received: true });
//   });

//   /**
//    * PATIENT → Cancel appointment and get refund 
//    */
//   cancelByPatient = catchAsync(async (req: ValidatedRequest<typeof cancelByPatientSchema>, res: Response, next: NextFunction) => {
//     const { refundAmount } = await this.cancelAppointmentByPatientUC.execute({
//       appointmentId: req.params.id,
//       patientId: req.user!.id,
//     });

//     res.status(StatusCode.OK).json({
//       success: true,
//       message: refundAmount > 0
//         ? `Appointment cancelled. ₹${refundAmount} has been refunded to your wallet.` 
//         : "Appointment cancelled. No refund applicable as per cancellation policy.",
//       refundAmount
//     });
//   });

//   /**
//    * CREATE STRIPE CHECKOUT SESSION
//    */
//   createCheckoutSession = catchAsync(async (req: ValidatedRequest<typeof createCheckoutSessionSchema>, res: Response, next: NextFunction) => {
//     const session = await this.createCheckoutSessionUC.execute({
//       appointmentId: req.params.id,
//       patientId: req.user!.id,
//     });

//     res.status(StatusCode.OK).json({
//       checkoutUrl: session.url,
//     });
//   });

//   /**
//    * GET APPOINTMENTS
//    */
//   getMyAppointments = catchAsync(async (req: ValidatedRequest<typeof getMyAppointmentsSchema>, res: Response, next: NextFunction) => {
//     const data = await this.getPatientAppointmentsWithDoctor.execute(req.user!.id);
//     res.status(StatusCode.OK).json({ success: true, data });
//   });
// }
import { Request, Response } from "express";
import { StatusCode } from "@common/enums";
import { AppError } from "@common/AppError";
import { catchAsync } from "@presentation/utils/catchAsync";

import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";

import { ICreateAppointmentUseCase } from "@application/interfaces/appointment/ICreateAppointmentUseCase";
import { IConfirmAppointmentUseCase } from "@application/interfaces/appointment/IConfirmAppointmentUseCase";
import { IGetPatientAppointmentUseCase } from "@application/interfaces/appointment/IGetPatientAppointmentsUseCase";
import { IGetPatientAppointmentsWithDoctor } from "@application/interfaces/queries/IGetPatientAppointmentsWithDoctor";
import { ICancelAppointmentByPatientUseCase } from "@application/interfaces/appointment/ICancelAppointmentByPatientUseCase";
import { ICreateCheckoutSessionUseCase } from "@application/interfaces/appointment/ICreateCheckoutSessionUseCase";
import { IVerifyWebhookUseCase } from "@application/interfaces/appointment/IVerifyWebhookUseCase";
import { IHandleStripeWebhookUseCase } from "@application/interfaces/appointment/IHandleStripeWebhookUseCase";

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
    const { doctorId, slotId } = req.body as {
      doctorId: string;
      slotId: string;
    };

    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);

    const appointment = await this.createAppointmentUC.execute({
      doctorId,
      slotId,
      patientId: userId,
    });

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
    const { id } = req.params as { id: string };

    await this.confirmAppointmentUC.execute({
      appointmentId: id,
    });

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
      throw new AppError("Invalid signature", StatusCode.BAD_REQUEST);
    }

    const event = await this.verifyWebhookUC.execute(req.body, sig);
    await this.handleStripeWebhookUC.execute(event);

    res.json({ received: true });
  });

  /**
   * PATIENT → Cancel appointment
   */
  cancelByPatient = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);

    const { refundAmount } = await this.cancelAppointmentByPatientUC.execute({
      appointmentId: id,
      patientId: userId,
    });

    res.status(StatusCode.OK).json({
      success: true,
      message:
        refundAmount > 0
          ? `Appointment cancelled. ₹${refundAmount} refunded to wallet.`
          : "Appointment cancelled. No refund applicable.",
      refundAmount,
    });
  });

  /**
   * CREATE STRIPE CHECKOUT SESSION
   */
  createCheckoutSession = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);

    const session = await this.createCheckoutSessionUC.execute({
      appointmentId: id,
      patientId: userId,
    });

    res.status(StatusCode.OK).json({
      checkoutUrl: session.url,
    });
  });

  /**
   * GET MY APPOINTMENTS
   */
  getMyAppointments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);

    const data = await this.getPatientAppointmentsWithDoctor.execute(userId);

    res.status(StatusCode.OK).json({
      success: true,
      data,
    });
  });
}