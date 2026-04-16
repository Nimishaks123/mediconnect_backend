import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IPatientRepository } from "@domain/interfaces/IPatientRepository";
import { AppError } from "@common/AppError";
import { GetPatientProfileDTO } from "@application/dtos/patient/GetPatientProfileDTO";
import { GetPatientProfileResponseDTO } from "@application/dtos/patient/GetPatientProfileResponseDTO";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";

import { IGetPatientProfileUseCase } from "../../interfaces/patient/IGetPatientProfileUseCase";

export class GetPatientProfileUseCase implements IGetPatientProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly patientRepo: IPatientRepository,
  ) {}

 
  async execute(input: GetPatientProfileDTO): Promise<GetPatientProfileResponseDTO> {
    const { userId } = input;

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }
    if (!user.isPatient()) {
      throw new AppError("Access denied: User is not a patient", StatusCode.BAD_REQUEST);
    }

    const patient = await this.patientRepo.findByUserId(userId);
    if (!patient) {
      throw new AppError(MESSAGES.PATIENT_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    return {
      user,
      patient
    };
  }
}
