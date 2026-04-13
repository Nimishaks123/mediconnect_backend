import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "../common/config";
import { connectMongoDB } from "../common/database/mongo";
import logger from "../common/logger";

import { loggerMiddleware } from "../presentation/middlewares/loggerMiddleware";
import { errorMiddleware } from "../presentation/middlewares/errorMiddleware";
import {
  authController,
  doctorController,
  adminController,
  adminAppointmentController,
  doctorScheduleController,
  doctorSlotController,
  appointmentController,
  doctorAppointmentController,
  patientWalletController,
  patientController,
  uploadController,
  adminWalletController,
  notificationController
} from "../main/di";

import { createRoutes } from "../presentation/routes";
const app = express();
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  appointmentController.stripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

app.use(cookieParser());
app.use(loggerMiddleware);

app.use(
  "/api",
  createRoutes(
    authController,
    doctorController,
    adminController,
    adminAppointmentController,
    doctorScheduleController,
    doctorSlotController,
    appointmentController,
    doctorAppointmentController,
    patientWalletController,
    patientController,
    uploadController,
    adminWalletController,
    notificationController
  )
);
app.use(errorMiddleware);
import { createServer } from "http";
import { SocketService } from "../infrastructure/services/SocketService";

const httpServer = createServer(app);

// Initialize Socket.io
const socketService = SocketService.getInstance();
socketService.init(httpServer);

(async () => {
  try {
    await connectMongoDB();

    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
})();
