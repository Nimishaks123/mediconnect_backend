import { Request, Response } from "express";
import { IGetUserNotificationsUseCase } from "../../application/interfaces/notification/IGetUserNotificationsUseCase";
import { IMarkNotificationAsReadUseCase } from "../../application/interfaces/notification/IMarkNotificationAsReadUseCase";
import { StatusCode } from "@common/enums";

export class NotificationController {
  constructor(
    private readonly getUserNotificationsUseCase: IGetUserNotificationsUseCase,
    private readonly markAsReadUseCase: IMarkNotificationAsReadUseCase
  ) {}

  public getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.getUserNotificationsUseCase.execute(userId, page, limit);

    res.status(StatusCode.OK).json({
      success: true,
      data: result
    });
  };

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.markAsReadUseCase.execute(id);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Notification marked as read"
    });
  };
}
