import { IPrescriptionRepository } from "@domain/interfaces/IPrescriptionRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { Prescription } from "@domain/entities/Prescription";
import { randomUUID } from "crypto";
import { CreatePrescriptionDTO } from "@application/dtos/prescription/CreatePrescriptionDTO";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { ICreatePrescriptionUseCase } from "@application/interfaces/prescription/ICreatePrescriptionUseCase";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import {ICreateNotificationUseCase} from "@application/interfaces/notification/ICreateNotificationUseCase"
import { NotificationType } from "@domain/enums/NotificationType";
export class CreatePrescriptionUseCase implements ICreatePrescriptionUseCase {
  constructor(
    private readonly prescriptionRepo: IPrescriptionRepository,
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo:IDoctorRepository,
    private readonly createNotificationUseCase: ICreateNotificationUseCase
  ) {}

async execute(
    dto: CreatePrescriptionDTO
  ): Promise<string> {
    const prescriptionId =
  `PR-${randomUUID().slice(0, 8)}`;

    const appointment =
      await this.appointmentRepo.findById(
        dto.appointmentId
      );

    if (!appointment) {
      throw new AppError(
        "Appointment not found",
        StatusCode.NOT_FOUND
      );
    }
    
    if(appointment.getStatus()!==AppointmentStatus.COMPLETED){
        throw new AppError("Prescription can only created after appointment",StatusCode.BAD_REQUEST);
    }
 
    const doctor=await this.doctorRepo.findByUserId(dto.doctorId);
    if(!doctor){
        throw new AppError("Doctor not found",StatusCode.NOT_FOUND);
    }
    if(appointment.getDoctorId()!==doctor.getId()){
        throw new AppError("Unauthorized",StatusCode.UNAUTHORIZED);
    }

    // Prevent duplicate prescription
    const existing =
      await this.prescriptionRepo.findByAppointmentId(
        dto.appointmentId
      );

    if (existing) {
      throw new AppError(
        "Prescription already exists",
        StatusCode.BAD_REQUEST
      );
    }

    const prescription =
      new Prescription(
        prescriptionId,
        dto.appointmentId,
        dto.doctorId,
        appointment.getPatientId(),
        dto.diagnosis,
        dto.medicines,
        dto.notes
      );

    await this.prescriptionRepo.save(
      prescription
    );
    console.log(
  "Creating prescription notification..."
);
await this.createNotificationUseCase.execute({
  userId: appointment.getPatientId(),
  title: "Prescription Available",
  message:
    "Your doctor has uploaded a prescription for your consultation.",
  type: NotificationType.PRESCRIPTION
});
    return prescriptionId;
  }
}