import { IConfirmAppointmentUseCase } from "@application/interfaces/appointment/IConfirmAppointmentUseCase";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { ConfirmAppointmentDTO } from "../../dtos/appointment/ConfirmAppointmentDTO";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IEventBus } from "@application/interfaces/IEventBus";
import { AppointmentConfirmedEvent } from "@domain/events/AppointmentConfirmedEvent";

import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enums/NotificationType";

import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";

export class ConfirmAppointmentUseCase implements IConfirmAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository,
    private readonly eventBus: IEventBus,
    private readonly createNotificationUseCase: ICreateNotificationUseCase
  ) {}

  async execute(dto: ConfirmAppointmentDTO): Promise<void> {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId);

    if (!appointment) {
      throw new AppError("Appointment not found", StatusCode.NOT_FOUND);
    }

    const doctor = await this.doctorRepo.findById(appointment.getDoctorId());
    let doctorName = "your doctor";
    
    if (doctor) {
      const user = await this.userRepo.findById(doctor.getUserId());
      if (user) {
        doctorName = user.name;
      }
    }

    appointment.confirm();

    await this.appointmentRepo.save(appointment);

    await this.eventBus.publish(
      new AppointmentConfirmedEvent(
        appointment.getId(),
        appointment.getPatientId(),
        appointment.getDoctorId(),
        appointment.getDate(),
        appointment.getStartTime(),
        appointment.getEndTime()
      )
    );

    await this.createNotificationUseCase.execute({
      userId: appointment.getPatientId(),
      title: "Appointment Confirmed",
      message: `Your appointment with Dr. ${doctorName} has been confirmed!`,
      type: NotificationType.APPOINTMENT
    });
  }
}


























