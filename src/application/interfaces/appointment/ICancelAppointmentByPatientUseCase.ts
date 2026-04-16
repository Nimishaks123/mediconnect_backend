export interface ICancelAppointmentByPatientUseCase {
  execute(dto: { appointmentId: string; patientId: string }): Promise<{ refundAmount: number }>;
}
