import { DomainError } from "@domain/errors/DomainError";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

export class ErrorMapper {
  static toAppError(error: DomainError): AppError {
    const message = error.message;

    // Mapping Domain Error Names to StatusCodes
    switch (error.name) {
      case "InvalidDoctorScheduleError":
        return new AppError(message, StatusCode.BAD_REQUEST);
      
      case "SlotAlreadyBookedError":
        return new AppError(message, StatusCode.CONFLICT);
      
      case "InvalidAppointmentStateError":
        return new AppError(message, StatusCode.BAD_REQUEST);
      
      case "AppointmentAlreadyFinalizedError":
        return new AppError(message, StatusCode.CONFLICT);

      default:
        return new AppError(message, StatusCode.BAD_REQUEST);
    }
  }
}
