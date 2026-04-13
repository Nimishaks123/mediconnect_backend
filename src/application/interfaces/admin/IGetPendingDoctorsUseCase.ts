// src/application/interfaces/admin/IGetPendingDoctorsUseCase.ts
import { GetPendingDoctorsOutputDTO } from "@application/dtos/admin/GetPendingDoctorsOutputDTO";

export interface IGetPendingDoctorsUseCase {
  execute(input: { 
    page: number; 
    limit: number; 
    search?: string; 
    sort?: "NEWEST" | "OLDEST" 
  }): Promise<GetPendingDoctorsOutputDTO>;
}
