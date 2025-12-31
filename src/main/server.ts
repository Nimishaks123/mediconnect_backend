import express from "express";
import logger from "../common/logger";
import { errorMiddleware } from "../presentation/middlewares/errorMiddleware";
import { loggerMiddleware } from "@presentation/middlewares/loggerMiddleware";
import cors from "cors";
import { config } from "../common/config";
import {connectMongoDB} from "../common/database/mongo"
import {
  authController,
  // patientController,
  doctorController,
  adminController,
  appointmentController
} from "../main/di";
import { createRoutes } from "../presentation/routes";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
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

app.use("/api", createRoutes(authController, doctorController, adminController,appointmentController));

app.use(errorMiddleware);
(async()=>{
  await connectMongoDB();


app.listen(config.port, () => {
logger.info(`Server running on port ${config.port}`);
});
})();
