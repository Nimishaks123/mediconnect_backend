// src/application/interfaces/appointment/IConfirmAppointmentUseCase.ts
import { ConfirmAppointmentDTO } from "../../dtos/appointment/ConfirmAppointmentDTO";

export interface IConfirmAppointmentUseCase {
  execute(dto: ConfirmAppointmentDTO): Promise<void>;
}
