

import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IPatientRepository } from "../../../domain/interfaces/IPatientRepository";
import { AppError } from "../../../common/AppError";

export class GetPatientProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly patientRepo: IPatientRepository,
  ) {}

  async execute(userId: string) {

    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    if (user.role !== "PATIENT") {
      throw new AppError("User is not a patient", 400);
    }

    const patient = await this.patientRepo.findByUserId(userId);
    if (!patient) throw new AppError("Patient profile not found", 404);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      },
      patient: patient
    };
  }
}
