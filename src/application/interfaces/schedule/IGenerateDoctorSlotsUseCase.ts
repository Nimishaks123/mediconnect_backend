import { Slot } from "../../../domain/entities/Slot";
import { GenerateDoctorSlotsDTO } from "../../dtos/schedule/GenerateDoctorSlotsDTO";

export interface IGenerateDoctorSlotsUseCase {
    execute(dto: GenerateDoctorSlotsDTO): Promise<Slot[]>;
}
