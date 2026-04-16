export interface ICheckCallEligibilityUseCase {
  execute(appointmentId: string, userId: string): Promise<boolean>;
}
