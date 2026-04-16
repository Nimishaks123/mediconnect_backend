import { IAppointmentQueryRepository } from "@application/interfaces/queries/IAppointmentQueryRepository";
import { AdminAppointmentDetailsDTO } from "@application/dtos/admin/AdminAppointmentDTO";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

import { IGetAdminAppointmentDetailsUseCase } from "@application/interfaces/admin/IGetAdminAppointmentDetailsUseCase";

export class GetAdminAppointmentDetailsUseCase implements IGetAdminAppointmentDetailsUseCase {
  constructor(private readonly appointmentQueryRepo: IAppointmentQueryRepository) {}

  async execute(id: string): Promise<AdminAppointmentDetailsDTO> {
    const appointment = await this.appointmentQueryRepo.findAdminAppointmentById(id);
    
    if (!appointment) {
      throw new AppError("Appointment not found", StatusCode.NOT_FOUND);
    }
    
    return appointment;
  }
}
