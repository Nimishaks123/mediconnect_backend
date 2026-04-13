import { INotificationService } from "../../application/interfaces/services/INotificationService";
import { SocketService } from "./SocketService";

export class SocketNotificationService implements INotificationService {
  private socketService = SocketService.getInstance();

  notifyUser(userId: string, event: string, data: any): void {
    this.socketService.emitToUser(userId, event, data);
  }

  notifyAll(event: string, data: any): void {
    this.socketService.emitToAll(event, data);
  }
}
