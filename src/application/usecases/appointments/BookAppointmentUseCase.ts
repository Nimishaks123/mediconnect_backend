
import { BookAppointmentDTO } from "@application/dtos/appointments/BookAppointmentDTO";
import { IBookAppointmentUseCase } from "@application/interfaces/appointments/IBookAppointmentUseCase";
import { IDoctorAvailabilityRepository } from "@domain/interfaces/IDoctorAvailabilityRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { Appointment } from "@domain/entities/Appointment";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { AppError } from "@common/AppError";

export class BookAppointmentUseCase
  implements IBookAppointmentUseCase
{
  constructor(
    private readonly availabilityRepo: IDoctorAvailabilityRepository,
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(input: BookAppointmentDTO): Promise<void> {
    const { doctorId, patientId, availabilityId } = input;

    /**
     * 1️⃣ ATOMIC SLOT RESERVATION
     * - If already booked → returns null
     */
    const slot =
      await this.availabilityRepo.reserveSlot(
        availabilityId
      );

    if (!slot) {
      throw new AppError(
        "This availability slot is already booked",
        409
      );
    }

    /**
     * 2️⃣ CREATE APPOINTMENT (DOMAIN ENTITY)
     */
    const appointment = new Appointment(
      null,
      doctorId,
      patientId,
      availabilityId,
      slot.getDate(),
      slot.getStartTime(),
      slot.getEndTime(),
      AppointmentStatus.PENDING
    );

    /**
     * 3️⃣ PERSIST APPOINTMENT
     * - Slot already reserved atomically
     
     */
    await this.appointmentRepo.create(appointment);
  }
}
