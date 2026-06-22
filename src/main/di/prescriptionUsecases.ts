import { CreatePrescriptionUseCase } from "@application/usecases/prescription/CreatePrescriptionUseCase";
import { createNotificationUseCase } from "./notificationUsecases";
import {
  appointmentRepository,
  doctorRepository,
  prescriptionRepository,
  userRepository,
} from "./repositories"
import { GetPrescriptionUseCase } from "@application/usecases/prescription/GetPrescriptionUseCase";
export const createPrescriptionUseCase =
  new CreatePrescriptionUseCase(
    prescriptionRepository,
    appointmentRepository,
    doctorRepository,
    createNotificationUseCase
  );
  export const getPrescriptionUC=new GetPrescriptionUseCase(prescriptionRepository,doctorRepository,appointmentRepository,userRepository);
