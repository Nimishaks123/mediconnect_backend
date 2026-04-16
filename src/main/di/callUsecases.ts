import { CheckCallEligibilityUseCase } from "@application/usecases/appointment/CheckCallEligibilityUseCase";
import { appointmentRepository, doctorRepository } from "./repositories";

export const checkCallEligibilityUseCase = new CheckCallEligibilityUseCase(
  appointmentRepository,
  doctorRepository
);
