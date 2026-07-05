import { CreditDoctorEarningsDTO } from "@application/dtos/wallet/CreditDoctorEarningsDTO";

export interface ICreditDoctorEarningsUseCase {

  execute(
    dto: CreditDoctorEarningsDTO
  ): Promise<void>;

}