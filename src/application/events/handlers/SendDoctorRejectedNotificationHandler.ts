import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { INotificationService } from "@domain/interfaces/INotificationService";
import { DoctorRejectedEvent } from "@domain/events/DoctorRejectedEvent";

export class SendDoctorRejectedNotificationHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly notificationService: INotificationService
  ) {}

  async handle(event: DoctorRejectedEvent): Promise<void> {
    const user = await this.userRepository.findById(event.userId);
    if (!user || !user.email) return;

    await this.notificationService.sendDoctorRejected(
      user.email,
      event.reason
    );
  }
}
