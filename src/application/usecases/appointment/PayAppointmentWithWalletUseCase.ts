import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { NotificationType } from "@domain/enums/NotificationType";
import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { IPayAppointmentWithWalletUseCase } from "@application/interfaces/appointment/IPayAppointmentWithWalletUseCase";
import { PayAppointmentWithWalletDTO } from "@application/dtos/appointment/PayAppointmentWithWalletDTO";
export class PayAppointmentWithWalletUseCase implements IPayAppointmentWithWalletUseCase{
    constructor(
        private readonly appointmentRepo:IAppointmentRepository,
        private readonly walletRepo:IWalletRepository,
        private readonly createNotificationUseCase:ICreateNotificationUseCase
    ){}
    async execute(dto:PayAppointmentWithWalletDTO):Promise<{success:boolean;message:string;}>{
        const {appointmentId,userId}=dto;
        //find appointment
        const appointment=await this.appointmentRepo.findById(appointmentId);
        if(!appointment){
            throw new AppError("appointment not found",StatusCode.NOT_FOUND);

        }
        if(appointment.getPatientId()!==userId){
            throw new AppError("unauthorised",StatusCode.UNAUTHORIZED);
        }
        
        if(appointment.getStatus()!==AppointmentStatus.PAYMENT_PENDING){
            throw new AppError("appointment already paid",StatusCode.BAD_REQUEST);
        }
        //find wallet
        const wallet=await this.walletRepo.findByUserId(userId);
        if(!wallet){
            throw new AppError("wallet not found",StatusCode.NOT_FOUND);
        }
        //amount
        const amount=appointment.getPrice();
        if(wallet.getBalance()<amount){
            throw new AppError("insufficient balance",StatusCode.BAD_REQUEST);

        }
        //debit wallet
        wallet.debit(amount,"appointment payment");
        appointment.confirm();
        //save wallet
        await this.walletRepo.save(wallet);
        //save appointment
        await this.appointmentRepo.save(appointment);
        //send notification
        await this.createNotificationUseCase.execute({userId,title:"appointment confirmed",message:"Your appointment has been confirmed using wallet amount",type:NotificationType.APPOINTMENT_CONFIRMED});
        return{
            success:true,
            message:"appointment paid suceessfully using wallet"
        }

    }

}