import { CreditDoctorEarningsDTO } from "@application/dtos/wallet/CreditDoctorEarningsDTO";
export interface CreditDoctorEarningsResult {
  doctorEarning: number;
  platformFee: number;
}
export interface ICreditDoctorEarningsUseCase {

  execute(
    dto: CreditDoctorEarningsDTO
  ): Promise<CreditDoctorEarningsResult>;

}