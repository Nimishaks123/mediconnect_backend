import { IGetPendingDoctorsUseCase } from "@application/interfaces/admin/IGetPendingDoctorsUseCase";
import { GetPendingDoctorsOutputDTO } from "@application/dtos/admin/GetPendingDoctorsOutputDTO";
import { IAdminDoctorQueryRepository } from "@application/interfaces/admin/IAdminDoctorQueryRepository";

export class GetPendingDoctorsUseCase implements IGetPendingDoctorsUseCase {
  constructor(
    private readonly adminDoctorQueryRepo: IAdminDoctorQueryRepository
  ) {}

  async execute(input: { 
    page: number; 
    limit: number; 
    search?: string; 
    sort?: "NEWEST" | "OLDEST" 
  }): Promise<GetPendingDoctorsOutputDTO> {
    const page = Math.max(1, Number(input.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(input.limit) || 10));
    const sort = input.sort === "OLDEST" ? "OLDEST" : "NEWEST";
    
    return this.adminDoctorQueryRepo.getPendingDoctors(page, limit, input.search, sort);
  }
}
