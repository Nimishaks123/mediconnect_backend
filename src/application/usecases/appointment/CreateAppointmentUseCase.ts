import { ICreateAppointmentUseCase } from "@application/interfaces/appointment/ICreateAppointmentUseCase";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { Appointment } from "@domain/entities/Appointment";
import { CreateAppointmentDTO } from "../../dtos/appointment/CreateAppointmentDTO";
import { CreateAppointmentResponseDTO } from "../../dtos/appointment/CreateAppointmentResponseDTO";
import { AppointmentMapper } from "../../mappers/AppointmentMapper";
import { v4 as uuid } from "uuid";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";

import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enums/NotificationType";

export class CreateAppointmentUseCase implements ICreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly createNotificationUseCase: ICreateNotificationUseCase
  ) {}

  async execute(dto: CreateAppointmentDTO): Promise<CreateAppointmentResponseDTO> {
    const { doctorId, patientId, availabilityId } = dto;

    const { doctorId: slotDoctorId, date, startTime, endTime } = 
      AppointmentMapper.parseAvailabilityId(availabilityId);

    if (slotDoctorId !== doctorId) {
      throw new AppError("Invalid slot data: doctor mismatch", StatusCode.BAD_REQUEST);
    }
    let doctor = await this.doctorRepo.findById(doctorId);
    if (!doctor) {
      doctor = await this.doctorRepo.findByUserId(doctorId);
    }

    if (!doctor) {
      console.warn(`[CreateAppointment] Doctor not found with identifier: ${doctorId}`);
      throw new AppError("Doctor not found", StatusCode.NOT_FOUND);
    }

    const conflict = await this.appointmentRepo.existsOverlappingSlot(
      doctor.getId(),
      date,
      startTime,
      endTime
    );

    if (conflict) {
      throw new AppError("Slot already booked", StatusCode.CONFLICT);
    }

    const appointment = Appointment.createPending(
      uuid(),
      doctor.getId(),
      patientId,
      date,
      startTime,
      endTime,
      doctor.consultationFee
    );

    await this.appointmentRepo.save(appointment);

    await this.createNotificationUseCase.execute({
      userId: doctor.getUserId(),
      title: "New Appointment Request",
      message: `You have a new appointment on ${appointment.getDate()} at ${appointment.getStartTime()}`,
      type: NotificationType.APPOINTMENT
    });

    return AppointmentMapper.toResponseDTO(appointment);
  }
}