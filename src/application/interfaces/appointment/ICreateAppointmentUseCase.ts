import { CreateAppointmentDTO } from "../../dtos/appointment/CreateAppointmentDTO";
import { CreateAppointmentResponseDTO } from "../../dtos/appointment/CreateAppointmentResponseDTO";

export interface ICreateAppointmentUseCase {
  execute(dto: CreateAppointmentDTO): Promise<CreateAppointmentResponseDTO>;
}
