import { RescheduleAppointmentDTO } from "../../dtos/appointment/RescheduleAppointmentDTO";

export interface IRescheduleAppointmentUseCase {
    execute(dto: RescheduleAppointmentDTO): Promise<void>;
}
