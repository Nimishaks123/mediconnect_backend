import { Appointment } from "@domain/entities/Appointment";
import { CreateAppointmentResponseDTO } from "../dtos/appointment/CreateAppointmentResponseDTO";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

export class AppointmentMapper {
  static toResponseDTO(appointment: Appointment): CreateAppointmentResponseDTO {
    return {
      id: appointment.getId(),
      doctorId: appointment.getDoctorId(),
      patientId: appointment.getPatientId(),
      date: appointment.getDate(),
      startTime: appointment.getStartTime(),
      endTime: appointment.getEndTime(),
      status: appointment.getStatus(),
      price: appointment.getPrice()
    };
  }

  static parseAvailabilityId(availabilityId: string): { doctorId: string; date: string; startTime: string; endTime: string } {
    const parts = availabilityId.split("_");

    if (parts.length !== 4) {
      throw new AppError("Invalid availabilityId format", StatusCode.BAD_REQUEST);
    }

    const [doctorId, date, startTime, endTime] = parts;

    return { doctorId, date, startTime, endTime };
  }
}
