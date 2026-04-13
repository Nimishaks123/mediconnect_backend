import { DoctorApprovedEvent } from "@domain/events/DoctorApprovedEvent";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { INotificationService } from "@domain/interfaces/INotificationService";

export class SendDoctorApprovedNotificationHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly notificationService: INotificationService
  ) {}

  async handle(event: DoctorApprovedEvent): Promise<void> {
    const user = await this.userRepository.findById(event.userId);
    if (!user || !user.email) return;

    await this.notificationService.sendDoctorApproved(user.email);
  }
}
