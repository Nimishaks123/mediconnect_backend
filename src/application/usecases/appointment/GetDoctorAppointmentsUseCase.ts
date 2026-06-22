import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { Appointment } from "@domain/entities/Appointment";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { IAutoCompleteAppointmentsUseCase } from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";
import logger from "@common/logger";

export interface GroupedAppointments {
  upcoming: Appointment[];
  past: Appointment[];
  recent: Appointment[];
}

export class GetDoctorAppointmentsUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly autoCompleteAppointmentsUC:
    IAutoCompleteAppointmentsUseCase
  ) {}

  async execute(userId: string): Promise<GroupedAppointments> {
    await this.autoCompleteAppointmentsUC.execute();
    let doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) {
      doctor = await this.doctorRepo.findById(userId);
    }

    if (!doctor) {
      logger.warn(`[GetDoctorAppointments] No doctor profile found for user ${userId}`);
      return { upcoming: [], past: [], recent: [] };
    }

    const doctorId = doctor.getId();
    console.log("Doctor ID:", doctorId);
    
    const allAppointments = await this.appointmentRepo.findAllByDoctorId(doctorId);
    console.log("Appointments fetched:", allAppointments.length);

    // 1. Filter pending payment appointments if they haven't been confirmed yet
    const validAppointments = allAppointments.filter(
      (appt) => appt.getStatus() !== AppointmentStatus.PAYMENT_PENDING
    );

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
validAppointments.forEach(appt => {
  console.log({
    date: appt.getDate(),
    startTime: appt.getStartTime(),
    endTime: appt.getEndTime(),
    status: appt.getStatus(),
    upcoming: appt.isUpcoming(),
    past: appt.isPast(),
  });
});
    // Upcoming: Future dates or future time today (must be confirmed/rescheduled)
    const upcoming = validAppointments.filter(appt => appt.isUpcoming());

    // Past: Older dates or passed time today
    const past = validAppointments.filter(appt => appt.isPast());

    // Recent: All appointments from TODAY + top 5 from the PAST 
    const todayAppointments = validAppointments.filter(appt => appt.getDate() === todayStr);
    const recentFromPast = past
      .filter(appt => appt.getDate() !== todayStr)
      .sort((a, b) => b.getDate().localeCompare(a.getDate()))
      .slice(0, 5);

    const recent = [...todayAppointments, ...recentFromPast];
    console.log(
  "Upcoming:",
  upcoming.map(a => ({
    bookingId: a.getBookingId(),
    date: a.getDate(),
    status: a.getStatus()
  }))
);

console.log(
  "Past:",
  past.map(a => ({
    bookingId: a.getBookingId(),
    date: a.getDate(),
    status: a.getStatus()
  }))
);

console.log(
  "Recent:",
  recent.map(a => ({
    bookingId: a.getBookingId(),
    date: a.getDate(),
    status: a.getStatus()
  }))
);

    return {
      upcoming,
      past,
      recent
    };
  }
}

