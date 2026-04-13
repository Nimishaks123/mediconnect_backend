import { IAppointmentQueryRepository } from "@application/interfaces/queries/IAppointmentQueryRepository";
import { GetAdminAppointmentsDTO, AdminAppointmentListResponseDTO } from "@application/dtos/admin/AdminAppointmentDTO";

export class GetAdminAppointmentsUseCase {
  constructor(private readonly appointmentQueryRepo: IAppointmentQueryRepository) {}

  async execute(input: GetAdminAppointmentsDTO): Promise<AdminAppointmentListResponseDTO> {
    const { page, limit, type, status, search, sort } = input;
    
    const { data, total } = await this.appointmentQueryRepo.findAdminAppointments(
      page, 
      limit, 
      type,
      status, 
      search, 
      sort
    );
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
