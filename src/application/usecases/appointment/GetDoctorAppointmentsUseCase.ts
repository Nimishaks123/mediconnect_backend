import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { Appointment } from "@domain/entities/Appointment";
import logger from "@common/logger";

export interface GroupedAppointments {
  upcoming: Appointment[];
  past: Appointment[];
  recent: Appointment[];
}

export class GetDoctorAppointmentsUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository
  ) {}

  async execute(userId: string): Promise<GroupedAppointments> {
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

    const upcoming = allAppointments.filter((appt) => appt.isUpcoming());
    const past = allAppointments.filter((appt) => appt.isPast());

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const todayAppointments = allAppointments.filter(
      (appt) => appt.getDate() === todayStr && (appt.isUpcoming() || appt.isPast())
    );
    const recentFromPast = past
      .filter((appt) => appt.getDate() !== todayStr)
      .sort((a, b) => b.getDate().localeCompare(a.getDate()))
      .slice(0, 5);

    const recent = [...todayAppointments, ...recentFromPast];

    return {
      upcoming,
      past,
      recent
    };
  }
}

