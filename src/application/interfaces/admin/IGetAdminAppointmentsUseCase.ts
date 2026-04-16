import { GetAdminAppointmentsDTO, AdminAppointmentListResponseDTO } from "@application/dtos/admin/AdminAppointmentDTO";

export interface IGetAdminAppointmentsUseCase {
  execute(input: GetAdminAppointmentsDTO): Promise<AdminAppointmentListResponseDTO>;
}
