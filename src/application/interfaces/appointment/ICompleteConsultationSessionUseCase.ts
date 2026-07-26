export interface ICompleteConsultationSessionUseCase {
  execute(dto: { appointmentId: string }): Promise<boolean>;
}
