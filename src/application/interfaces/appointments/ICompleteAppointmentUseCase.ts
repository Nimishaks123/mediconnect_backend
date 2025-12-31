// application/interfaces/appointments/ICompleteAppointmentUseCase.ts
import { CompleteAppointmentDTO } from "../../dtos/appointments/CompleteAppointmentDTO";

export interface ICompleteAppointmentUseCase {
  execute(input: CompleteAppointmentDTO): Promise<void>;
}
