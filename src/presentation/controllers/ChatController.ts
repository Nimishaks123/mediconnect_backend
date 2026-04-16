import { Response } from "express";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { catchAsync } from "../utils/catchAsync";
import { ChatMapper } from "../mappers/chat/ChatMapper";
import {
  ISendMessageUseCase,
  IGetMessagesUseCase,
  IMarkConversationAsReadUseCase,
  IGetConversationListUseCase,
  SendMessageDTO
} from "@application/interfaces/chat";

export class ChatController {
  constructor(
    private readonly sendMessageUseCase: ISendMessageUseCase,
    private readonly getMessagesUseCase: IGetMessagesUseCase,
    private readonly markConversationAsReadUseCase: IMarkConversationAsReadUseCase,
    private readonly getConversationListUseCase: IGetConversationListUseCase
  ) {}

  sendMessage = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const { receiverId, conversationId, content } = req.body;
    
    const sendMessageDTO: SendMessageDTO = {
      senderId: req.user.id,
      receiverId,
      conversationId,
      content,
    };

    const message = await this.sendMessageUseCase.execute(sendMessageDTO);

    res.status(StatusCode.CREATED).json(ChatMapper.toResponse(message));
  });

  getMessages = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { conversationId } = req.params;
    const { page, limit } = req.query as any;

    const messages = await this.getMessagesUseCase.execute({
      conversationId: conversationId as string,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(StatusCode.OK).json(ChatMapper.toList(messages));
  });

  getConversations = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const conversations = await this.getConversationListUseCase.execute(req.user.id);
    res.status(StatusCode.OK).json(conversations);
  });

  markAsRead = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const { conversationId } = req.params;

    await this.markConversationAsReadUseCase.execute({
      conversationId: conversationId as string,
      userId: req.user.id,
    });
    res.status(StatusCode.OK).json({ success: true });
  });
}
