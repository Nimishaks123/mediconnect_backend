import { PatientAppointmentDTO } from "../../dtos/appointment/PatientAppointmentDTO";
import { DoctorSlotWithBookingDTO } from "../../dtos/appointment/DoctorSlotWithBookingDTO";
import { AppointmentForDoctorDTO } from "../../dtos/appointment/AppointmentForDoctorDTO";
import { AdminAppointmentListItemDTO, AdminAppointmentDetailsDTO } from "../../dtos/admin/AdminAppointmentDTO";

export interface IAppointmentQueryRepository {
  findByPatientId(patientId: string): Promise<PatientAppointmentDTO[]>;
  findByDoctorId(doctorId: string): Promise<AppointmentForDoctorDTO[]>;
  findDoctorSlotsWithBooking(
    doctorId: string,
    date: string
  ): Promise<DoctorSlotWithBookingDTO[]>;

  findAdminAppointments(
    page: number,
    limit: number,
    type: "UPCOMING" | "PAST" | "RECENT",
    status?: string,
    search?: string,
    sort?: "LATEST" | "OLDEST"
  ): Promise<{ data: AdminAppointmentListItemDTO[]; total: number }>;

  findAdminAppointmentById(id: string): Promise<AdminAppointmentDetailsDTO | null>;
}
