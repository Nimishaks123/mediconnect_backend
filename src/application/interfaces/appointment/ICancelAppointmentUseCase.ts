import { CancelAppointmentDTO } from "../../dtos/appointment/CancelAppointmentDTO";

export interface ICancelAppointmentUseCase {
    execute(dto: CancelAppointmentDTO): Promise<void>;
}
