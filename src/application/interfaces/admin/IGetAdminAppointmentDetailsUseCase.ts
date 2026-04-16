import { AdminAppointmentDetailsDTO } from "@application/dtos/admin/AdminAppointmentDTO";

export interface IGetAdminAppointmentDetailsUseCase {
  execute(id: string): Promise<AdminAppointmentDetailsDTO>;
}
