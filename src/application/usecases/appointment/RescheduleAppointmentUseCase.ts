import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IEventBus } from "@application/interfaces/IEventBus";
import { RescheduleAppointmentDTO } from "../../dtos/appointment/RescheduleAppointmentDTO";
import { AppointmentRescheduledEvent } from "@domain/events/AppointmentRescheduledEvent";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { DateRange } from "@domain/value-objects/DateRange";
import { IRRulePolicy } from "@domain/policies/IRRulePolicy";
import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enums/NotificationType";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";

dayjs.extend(utc);
dayjs.extend(timezone);

export class RescheduleAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly scheduleRepo: IDoctorScheduleRepository,
    private readonly eventBus: IEventBus,
    private readonly rrulePolicy: IRRulePolicy,
    private readonly createNotificationUseCase: ICreateNotificationUseCase,
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: RescheduleAppointmentDTO): Promise<void> {
    const { appointmentId, doctorId, newDateTime } = dto;
    
    // Parse newDateTime into separate date, startTime, and endTime
    const parsedDateTime = dayjs.tz(newDateTime);
    const date = parsedDateTime.format('YYYY-MM-DD');
    const startTime = parsedDateTime.format('HH:mm');
    const endTime = parsedDateTime.add(1, 'hour').format('HH:mm'); // Assuming 1-hour appointment

    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", StatusCode.NOT_FOUND);
    }

    if (appointment.getDoctorId() !== doctorId) {
      throw new AppError("Not authorized to reschedule this appointment", StatusCode.FORBIDDEN);
    }

    const permittedStatuses = [
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.RESCHEDULED,
    ];

    if (!permittedStatuses.includes(appointment.getStatus())) {
      throw new AppError(
        "Only confirmed or rescheduled appointments can be rescheduled",
        StatusCode.BAD_REQUEST
      );
    }

    const schedules = await this.scheduleRepo.findByDoctorId(doctorId);
    if (!schedules || schedules.length === 0) {
      throw new AppError("Doctor schedule not found", StatusCode.NOT_FOUND);
    }

    const schedule = schedules[0];
    const tz = schedule.timezone || "UTC";
    const newSlotTime = dayjs.tz(`${date} ${startTime}`, "YYYY-MM-DD HH:mm", tz);
    const now = dayjs().tz(tz);

    if (newSlotTime.isBefore(now)) {
      throw new AppError("Cannot reschedule to a past date or time", StatusCode.BAD_REQUEST);
    }

    // ✅ Use domain aggregate for slot generation
    const range = DateRange.create(date, date);
    const availableSlots = schedule.generateSlots(range, this.rrulePolicy);
    
    const slotExists = availableSlots.some(
      (s) => s.startTime === startTime && s.endTime === endTime
    );

    if (!slotExists) {
      throw new AppError("The selected slot does not exist in your schedule", StatusCode.BAD_REQUEST);
    }

    const conflict = await this.appointmentRepo.existsOverlappingSlot(
      doctorId,
      date,
      startTime,
      endTime,
      appointmentId
    );

    if (conflict) {
      throw new AppError(
        "Slot already booked or occupied by another appointment",
        StatusCode.CONFLICT
      );
    }

    appointment.updateDateTime(date, startTime, endTime);
    appointment.setStatus(AppointmentStatus.RESCHEDULED);

    await this.appointmentRepo.save(appointment);

    await this.eventBus.publish(
      new AppointmentRescheduledEvent(
        appointment.getId(),
        appointment.getPatientId(),
        appointment.getDoctorId(),
        date,
        startTime,
        endTime
      )
    );

    const doctor = await this.doctorRepo.findById(appointment.getDoctorId());
    const patient = await this.userRepo.findById(appointment.getPatientId());
    
    const doctorUser = doctor ? await this.userRepo.findById(doctor.getUserId()) : null;
    const doctorName = doctorUser ? doctorUser.name : "your doctor";
    const patientName = patient ? patient.name : "the patient";

    // NOTIFY PATIENT
    await this.createNotificationUseCase.execute({
      userId: appointment.getPatientId(),
      title: "Appointment Rescheduled",
      message: `Your appointment with Dr. ${doctorName} has been rescheduled to ${date} at ${startTime}`,
      type: NotificationType.APPOINTMENT_RESCHEDULED
    });

    // NOTIFY DOCTOR
    await this.createNotificationUseCase.execute({
      userId: doctorUser?.id || appointment.getDoctorId(),
      title: "Appointment Rescheduled",
      message: `You have successfully rescheduled the appointment with ${patientName}`,
      type: NotificationType.APPOINTMENT_RESCHEDULED
    });
  }
}
