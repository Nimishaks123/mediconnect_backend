import { PrescriptionDetailsDTO } from "@application/dtos/prescription/PrescriptionDetailsDTO";
import { Prescription } from "@domain/entities/Prescription";
export interface IGetPrescriptionUseCase{
    execute(appointmentId:string,userId: string,
  role: string):Promise<PrescriptionDetailsDTO>;
}