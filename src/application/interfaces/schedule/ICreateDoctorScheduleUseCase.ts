import { CreateDoctorScheduleInputDTO } from "../../dtos/doctorSchedule/CreateDoctorScheduleInputDTO";
import { DoctorSchedule } from "../../../domain/entities/DoctorSchedule";

export interface ICreateDoctorScheduleUseCase {
    execute(dto: CreateDoctorScheduleInputDTO): Promise<DoctorSchedule>;
}
