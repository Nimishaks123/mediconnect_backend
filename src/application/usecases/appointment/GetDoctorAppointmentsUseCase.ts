import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { Appointment } from "@domain/entities/Appointment";
import { PaymentStatus } from "@domain/enums/PaymentStatus";

export interface GroupedAppointments {
  upcoming: Appointment[];
  past: Appointment[];
  recent: Appointment[];
}

export class GetDoctorAppointmentsUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(doctorId: string): Promise<GroupedAppointments> {
    const allAppointments = await this.appointmentRepo.findAllByDoctorId(doctorId);

    // 1. Exclude pending payment
    const validAppointments = allAppointments.filter(
      (appt) => appt.getPaymentStatus() !== PaymentStatus.PENDING
    );

    // 2. Recent = last 5 created
    const recent = [...validAppointments]
      .sort((a, b) => {
        const timeA = a.getCreatedAt()?.getTime() || 0;
        const timeB = b.getCreatedAt()?.getTime() || 0;
        return timeB - timeA;
      })
      .slice(0, 5);

    return {
      upcoming: validAppointments.filter(appt => appt.isUpcoming()),
      past: validAppointments.filter(appt => appt.isPast()),
      recent: recent
    };
  }
}

