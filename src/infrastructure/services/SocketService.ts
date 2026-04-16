import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "@common/logger";

export class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]
  private activeCalls: Map<string, { doctorId: string; startTime: Date }> = new Map();

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
        
        // Broadcast online status
        this.emitToAll("user_status", { userId, status: "online" });
      }

      // 1. Typing Indicator
      socket.on("typing", (data: { receiverId: string, conversationId: string }) => {
        this.emitToUser(data.receiverId, "user_typing", { 
          senderId: userId, 
          conversationId: data.conversationId,
          isTyping: true 
        });
      });

      socket.on("stop_typing", (data: { receiverId: string, conversationId: string }) => {
        this.emitToUser(data.receiverId, "user_typing", { 
          senderId: userId, 
          conversationId: data.conversationId,
          isTyping: false 
        });
      });

      // 2. Read Receipts (Real-time)
      socket.on("message_seen", (data: { senderId: string, conversationId: string }) => {
        this.emitToUser(data.senderId, "messages_seen", {
          receiverId: userId,
          conversationId: data.conversationId
        });
      });

      // 3. Video Call Signaling
      socket.on("join_call_room", ({ appointmentId }) => {
        socket.join(appointmentId);
        logger.info(`Socket ${socket.id} joined call room: ${appointmentId}`);
        console.log(`[Socket] User joined room: ${appointmentId}`);
      });

      socket.on("start_call", async ({ appointmentId, userId, doctorName, receiverId }) => {
        if (this.activeCalls.has(appointmentId)) {
          return socket.emit("call_error", { message: "Call already in progress." });
        }

        this.activeCalls.set(appointmentId, { doctorId: userId, startTime: new Date() });
        socket.join(appointmentId);

        logger.info(`Doctor ${userId} starting call for patient ${receiverId} (Appointment: ${appointmentId})`);
        
        // Emit to the specific patient directly (reaches all their tabs)
        this.emitToUser(receiverId, "incoming_call", { 
          appointmentId, 
          doctorName: doctorName || "Your Doctor" 
        });
      });

      socket.on("accept_call", ({ appointmentId, userId }) => {
        socket.join(appointmentId);
        logger.info(`User ${userId} accepted call: ${appointmentId}`);
        socket.to(appointmentId).emit("call_accepted", { userId });
      });

      socket.on("reject_call", ({ appointmentId }) => {
        this.activeCalls.delete(appointmentId);
        this.io?.to(appointmentId).emit("call_rejected");
      });

      socket.on("join_call", ({ appointmentId, userId }) => {
        socket.join(appointmentId);
        socket.to(appointmentId).emit("user_joined", { userId });
      });

      socket.on("offer", (data) => {
        socket.to(data.appointmentId).emit("offer", {
          offer: data.offer,
          senderId: userId
        });
      });

      socket.on("answer", (data) => {
        socket.to(data.appointmentId).emit("answer", {
          answer: data.answer,
          senderId: userId
        });
      });

      socket.on("ice_candidate", (data) => {
        socket.to(data.appointmentId).emit("ice_candidate", {
          candidate: data.candidate,
          senderId: userId
        });
      });

      socket.on("leave_call", (data) => {
        this.activeCalls.delete(data.appointmentId);
        socket.leave(data.appointmentId);
        this.io?.to(data.appointmentId).emit("user_left", { userId });
      });

      socket.on("disconnect", () => {
        if (userId) {
          const sockets = this.userSockets.get(userId) || [];
          const index = sockets.indexOf(socket.id);
          if (index > -1) {
            sockets.splice(index, 1);
          }
          if (sockets.length === 0) {
            this.userSockets.delete(userId);
            // Broadcast offline status
            this.emitToAll("user_status", { userId, status: "offline" });
          } else {
            this.userSockets.set(userId, sockets);
          }
          logger.info(`User disconnected: ${userId} (${socket.id})`);
        }
      });
    });
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
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
