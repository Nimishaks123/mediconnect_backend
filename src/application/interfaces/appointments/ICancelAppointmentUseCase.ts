// application/interfaces/appointments/ICancelAppointmentUseCase.ts
import { CancelAppointmentDTO } from "../../dtos/appointments/CancelAppointmentDTO";

export interface ICancelAppointmentUseCase {
  execute(input: CancelAppointmentDTO): Promise<void>;
}
