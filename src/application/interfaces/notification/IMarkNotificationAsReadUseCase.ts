import { MarkNotificationAsReadDTO } from "../../dtos/notification/MarkNotificationAsReadDTO";

export interface IMarkNotificationAsReadUseCase {
  execute(dto: MarkNotificationAsReadDTO): Promise<void>;
}
