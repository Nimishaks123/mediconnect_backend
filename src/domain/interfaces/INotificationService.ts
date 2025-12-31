// src/domain/interfaces/INotificationService.ts
export interface INotificationService {
  sendDoctorApproved(email: string): Promise<void>;
  sendDoctorRejected(email: string, reason: string): Promise<void>;
}
