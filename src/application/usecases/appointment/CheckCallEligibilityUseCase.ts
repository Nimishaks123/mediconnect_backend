import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";

import { ICheckCallEligibilityUseCase } from "../../interfaces/appointment/ICheckCallEligibilityUseCase";

export class CheckCallEligibilityUseCase implements ICheckCallEligibilityUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly doctorRepo: IDoctorRepository
  ) {}

  async execute(appointmentId: string, userId: string): Promise<boolean> {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    
    if (!appointment) return false;

    // Check status - usually only CONFIRMED or RESCHEDULED
    const allowedStatuses = ["CONFIRMED", "RESCHEDULED"];
    if (!allowedStatuses.includes(appointment.getStatus())) {
      return false;
    }

    // Check if user is the patient
    if (appointment.getPatientId() === userId) return true;

    // Check if user is the doctor
    // Appointment stores doctorId (profile ID), we need to get user ID for that profile
    const doctorProfile = await this.doctorRepo.findById(appointment.getDoctorId());
    if (doctorProfile && doctorProfile.getUserId() === userId) return true;

    return false;
  }
}
