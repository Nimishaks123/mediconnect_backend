// src/application/interfaces/admin/IGetPendingDoctorsUseCase.ts
import { GetPendingDoctorsOutputDTO } from "@application/dtos/admin/GetPendingDoctorsOutputDTO";

export interface IGetPendingDoctorsUseCase {
  execute(): Promise<GetPendingDoctorsOutputDTO>;
}
