// application/interfaces/appointments/IConfirmAppointmentUseCase.ts
import { ConfirmAppointmentDTO } from "../../dtos/appointments/ConfirmAppointmentDTO";

export interface IConfirmAppointmentUseCase {
  execute(input: ConfirmAppointmentDTO): Promise<void>;
}
