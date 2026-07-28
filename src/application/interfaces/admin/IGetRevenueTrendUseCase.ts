import { RevenueTrendDTO } from "@application/dtos/admin/RevenueTrendDTO";

export interface IGetRevenueTrendUseCase {
  execute(period?: string): Promise<RevenueTrendDTO>;
}
