import { RevenueTrendDTO } from "@application/dtos/admin/RevenueTrendDTO";

export interface IGetRevenueTrendUseCase {
  execute(): Promise<RevenueTrendDTO>;
}
