export interface IStartConsultationSessionUseCase {
  execute(dto: { appointmentId: string }): Promise<boolean>;
}
