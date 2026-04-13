import { Request } from "express";
import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { CreateAppointmentDTO } from "@application/dtos/appointment/CreateAppointmentDTO";
import { ConfirmAppointmentDTO } from "@application/dtos/appointment/ConfirmAppointmentDTO";
import { RescheduleAppointmentDTO } from "@application/dtos/appointment/RescheduleAppointmentDTO";
import { Appointment } from "@domain/entities/Appointment";
import { AppointmentForDoctorDTO } from "@application/dtos/appointment/AppointmentForDoctorDTO";
import { GroupedAppointments } from "@application/usecases/appointment/GetDoctorAppointmentsUseCase";
import { AppointmentMapper } from "@application/mappers/AppointmentMapper";
import { AppointmentCancelReason } from "@domain/enums/AppointmentCancelReason";


export class AppointmentPresentationMapper {
  static toCreateAppointmentDTO(req: AuthenticatedRequest): CreateAppointmentDTO {
    return {
      doctorId: req.body.doctorId,
      availabilityId: req.body.availabilityId,
      patientId: req.user!.id,
    };
  }

  static toConfirmAppointmentDTO(req: Request): ConfirmAppointmentDTO {
    return {
      appointmentId: req.params.id,
    };
  }

  static toCancelByPatientDTO(req: AuthenticatedRequest): { appointmentId: string; patientId: string } {
    return {
      appointmentId: req.params.id,
      patientId: req.user!.id,
    };
  }

  static toRescheduleAppointmentDTO(req: AuthenticatedRequest, doctorId: string): RescheduleAppointmentDTO {
    const { newSlotId } = req.body;
    const parsed = AppointmentMapper.parseAvailabilityId(newSlotId);

    return {
      appointmentId: req.params.id,
      doctorId: doctorId,
      date: parsed.date,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
    };
  }

  static toCancelByDoctorDTO(req: AuthenticatedRequest, doctorId: string): { appointmentId: string; doctorId: string; reason: "EXPIRED" | "FAILED" | "CANCELLED" } {
    const reason = (req.body.reason as AppointmentCancelReason) || AppointmentCancelReason.CANCELLED;
    return {
      appointmentId: req.params.id,
      doctorId: doctorId,
      reason:Object.values(AppointmentCancelReason).includes(reason)
      ? reason
      : AppointmentCancelReason.CANCELLED,
    };
  }

  static toCreateCheckoutSessionDTO(req: AuthenticatedRequest): { appointmentId: string; patientId: string } {
    return {
      appointmentId: req.params.id,
      patientId: req.user!.id,
    };
  }

  static toGetPatientAppointmentsDTO(req: AuthenticatedRequest): string {
    return req.user!.id;
  }

  static toGetDoctorAppointmentsDTO(req: AuthenticatedRequest): string {
    return req.user!.id;
  }

  static toAppointmentForDoctorDTO(appointment: Appointment): AppointmentForDoctorDTO {
    return {
      appointmentId: appointment.getId(),
      patientName: appointment.getPatientName() || "Unknown Patient",
      date: appointment.getDate(),
      startTime: appointment.getStartTime(),
      endTime: appointment.getEndTime(),
      status: appointment.getStatus(),
      paymentStatus: appointment.getPaymentStatus(),
      videoCallAvailable: appointment.canStartVideoCall(),
    };
  }

  static toGroupedDoctorAppointmentsDTO(grouped: GroupedAppointments): {
    upcoming: AppointmentForDoctorDTO[];
    past: AppointmentForDoctorDTO[];
    recent: AppointmentForDoctorDTO[];
  } {
    return {
      upcoming: grouped.upcoming.map(app => AppointmentPresentationMapper.toAppointmentForDoctorDTO(app)),
      past: grouped.past.map(app => AppointmentPresentationMapper.toAppointmentForDoctorDTO(app)),
      recent: grouped.recent.map(app => AppointmentPresentationMapper.toAppointmentForDoctorDTO(app)),
    };
  }
}
