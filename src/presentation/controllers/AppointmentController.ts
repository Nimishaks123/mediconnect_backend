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
import { IPayAppointmentWithWalletUseCase } from "@application/interfaces/appointment/IPayAppointmentWithWalletUseCase";
export class AppointmentController {
  constructor(
    private readonly createAppointmentUC: ICreateAppointmentUseCase,
    private readonly confirmAppointmentUC: IConfirmAppointmentUseCase,
    private readonly getPatientAppointmentsUC: IGetPatientAppointmentUseCase,
    private readonly getPatientAppointmentsWithDoctor: IGetPatientAppointmentsWithDoctor,
    private readonly cancelAppointmentByPatientUC: ICancelAppointmentByPatientUseCase,
    private readonly createCheckoutSessionUC: ICreateCheckoutSessionUseCase,
    private readonly verifyWebhookUC: IVerifyWebhookUseCase,
    private readonly handleStripeWebhookUC: IHandleStripeWebhookUseCase,
    private readonly payAppointmentWithWalletUC:IPayAppointmentWithWalletUseCase
  ) { }
//create appointment
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

  
    //Confirm appointment
   
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

  // STRIPE WEBHOOK
  
  stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    if (!sig) {
      throw new AppError("Invalid signature", StatusCode.BAD_REQUEST);
    }

    const event = await this.verifyWebhookUC.execute(req.body, sig);
    await this.handleStripeWebhookUC.execute(event);

    res.json({ received: true });
  });

   // Cancel appointment
  
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

  //CREATE STRIPE CHECKOUT SESSION
  
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

  // GET MY APPOINTMENTS
  
  getMyAppointments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCode.UNAUTHORIZED);

    const data = await this.getPatientAppointmentsWithDoctor.execute(userId);

    res.status(StatusCode.OK).json({
      success: true,
      data,
    });
  });

payWithWallet=catchAsync(async(req:AuthenticatedRequest,res:Response)=>{
  if(!req.user?.id){
    throw new AppError("User not authenticated",StatusCode.UNAUTHORIZED);
  }
  const {appointmentId}=req.body;
  const result=await this.payAppointmentWithWalletUC.execute({appointmentId,userId:req.user.id});
  res.status(StatusCode.OK).json(result);
});
}
