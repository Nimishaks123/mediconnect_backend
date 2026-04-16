export interface ICreateCheckoutSessionUseCase {
    execute(dto: { appointmentId: string; patientId: string }): Promise<any>;
}
