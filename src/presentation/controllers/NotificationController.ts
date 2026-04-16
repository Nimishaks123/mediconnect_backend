import { Response } from "express";
import { IGetUserNotificationsUseCase } from "../../application/interfaces/notification/IGetUserNotificationsUseCase";
import { IMarkNotificationAsReadUseCase } from "../../application/interfaces/notification/IMarkNotificationAsReadUseCase";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export class NotificationController {
  constructor(
    private readonly getUserNotificationsUseCase: IGetUserNotificationsUseCase,
    private readonly markAsReadUseCase: IMarkNotificationAsReadUseCase
  ) {}

  public getUserNotifications = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.getUserNotificationsUseCase.execute({
      userId,
      page,
      limit,
    });

    res.status(StatusCode.OK).json(result);
  });

  public markAsRead = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;

    const result = await this.markAsReadUseCase.execute({ id });

    res.status(StatusCode.OK).json(result);
  });
}
