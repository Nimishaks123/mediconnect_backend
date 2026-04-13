import { NotificationType } from "../enums/NotificationType";

export class Notification {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly title: string,
    private readonly message: string,
    private readonly type: NotificationType,
    private isRead: boolean,
    private readonly createdAt: Date
  ) {}

  public static create(
    id: string,
    userId: string,
    title: string,
    message: string,
    type: NotificationType
  ): Notification {
    return new Notification(id, userId, title, message, type, false, new Date());
  }

  // Getters
  public getId(): string { return this.id; }
  public getUserId(): string { return this.userId; }
  public getTitle(): string { return this.title; }
  public getMessage(): string { return this.message; }
  public getType(): NotificationType { return this.type; }
  public getIsRead(): boolean { return this.isRead; }
  public getCreatedAt(): Date { return this.createdAt; }

  // Actions
  public markAsRead(): void {
    this.isRead = true;
  }
}
