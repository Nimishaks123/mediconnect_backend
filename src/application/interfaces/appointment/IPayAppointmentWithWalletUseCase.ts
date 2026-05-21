import { PayAppointmentWithWalletDTO } from "@application/dtos/appointment/PayAppointmentWithWalletDTO"
export interface IPayAppointmentWithWalletUseCase{
    execute(dto:PayAppointmentWithWalletDTO):Promise<{success:boolean,message:string}>;
}