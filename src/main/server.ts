import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "../common/config";
import { connectMongoDB } from "../common/database/mongo";
import logger from "../common/logger";
import { appointmentScheduler }
from "@main/di/schedulers";
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
  notificationController,
  chatController,
  callController,
  tokenService,
  prescriptionController,
  reviewController,
  doctorWalletController,
  platformSettingsController,
  platformWalletController,
  adminDashboardController,
  analyticsReportController,
  publicController,
  startConsultationSessionUseCase,
  completeConsultationSessionUseCase
} from "../main/di";

import { createRoutes } from "../presentation/routes";
const app = express();
//  before express.json()
app.post(
  "/api/webhook/stripe",
  express.raw({ type: "*/*" }),
  (req, res,next) => appointmentController.stripeWebhook(req, res,next)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || config.frontendUrls.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );

  next();
});
app.use(loggerMiddleware);

app.use(
  "/api",
  createRoutes(
    authController,
    doctorController,
    adminController,
    adminDashboardController,
    analyticsReportController,
    adminAppointmentController,
    doctorScheduleController,
    doctorSlotController,
    appointmentController,
    doctorAppointmentController,
    patientWalletController,
    doctorWalletController,
    patientController,
    uploadController,
    adminWalletController,
    platformSettingsController,
    platformWalletController,
    notificationController,
    chatController,
    callController,
    prescriptionController,
    reviewController,
    publicController,
    tokenService,
 
  )
);
app.use(errorMiddleware);
import { createServer } from "http";
import { SocketService } from "../infrastructure/services/SocketService";

const httpServer = createServer(app);

// Initialize Socket io
const socketService = SocketService.getInstance();
socketService.setConsultationUseCases(
  startConsultationSessionUseCase,
  completeConsultationSessionUseCase
);
socketService.init(httpServer);

(async () => {
  try {
    await connectMongoDB();
    appointmentScheduler.start();


    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
})();
