import { CreatePrescriptionDTO } from "@application/dtos/prescription/CreatePrescriptionDTO";
export interface ICreatePrescriptionUseCase{
    execute(dto:CreatePrescriptionDTO):Promise<string>;
}