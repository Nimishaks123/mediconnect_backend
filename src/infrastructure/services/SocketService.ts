import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "@common/logger";

export class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public init(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
      }
    });

    this.io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId as string;
      
      if (userId) {
        const sockets = this.userSockets.get(userId) || [];
        sockets.push(socket.id);
        this.userSockets.set(userId, sockets);
        logger.info(`User connected: ${userId} (${socket.id})`);
      }

      socket.on("disconnect", () => {
        if (userId) {
          const sockets = this.userSockets.get(userId) || [];
          const index = sockets.indexOf(socket.id);
          if (index > -1) {
            sockets.splice(index, 1);
          }
          if (sockets.length === 0) {
            this.userSockets.delete(userId);
          } else {
            this.userSockets.set(userId, sockets);
          }
          logger.info(`User disconnected: ${userId} (${socket.id})`);
        }
      });
    });
  }

  public emitToUser(userId: string, event: string, data: any): void {
    if (!this.io) {
      logger.warn("Socket.io not initialized");
      return;
    }

    const sockets = this.userSockets.get(userId);
    console.log(`[SocketService] Found ${sockets?.length || 0} active sockets for user: ${userId}`);
    if (sockets && sockets.length > 0) {
      sockets.forEach(socketId => {
        console.log(`[SocketService] Emitting event '${event}' to socket: ${socketId}`);
        this.io?.to(socketId).emit(event, data);
      });
      logger.info(`Notification sent to user ${userId}: ${event}`);
    } else {
      logger.info(`User ${userId} not connected, notification skipped for ${event}`);
    }
  }

  public emitToAll(event: string, data: any): void {
    if (!this.io) return;
    this.io.emit(event, data);
  }
}
