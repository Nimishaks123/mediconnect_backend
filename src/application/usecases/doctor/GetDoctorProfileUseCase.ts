import { IGetDoctorProfileUseCase } from "../../interfaces/doctor/IGetDoctorProfileUseCase";
import { GetDoctorProfileDTO } from "../../dtos/doctor/GetDoctorProfileDTO";
import { GetDoctorProfileResponseDTO } from "../../dtos/doctor/GetDoctorProfileDTO";

import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IDoctorRepository } from "../../../domain/interfaces/IDoctorRepository";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import { DoctorMapper } from "../../mappers/DoctorMapper";

export class GetDoctorProfileUseCase implements IGetDoctorProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly doctorRepo: IDoctorRepository
  ) {}

  async execute(
    input: GetDoctorProfileDTO
  ): Promise<GetDoctorProfileResponseDTO> {
    const { userId } = input;

    if (!userId) {
      throw new AppError(
        MESSAGES.USER_NOT_FOUND,
        StatusCode.BAD_REQUEST
      );
    }
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        MESSAGES.USER_NOT_FOUND,
        StatusCode.NOT_FOUND
      );
    }

    if (user.role !== "DOCTOR") {
      throw new AppError(
        MESSAGES.USER_NOT_DOCTOR ?? "User is not a doctor",
        StatusCode.BAD_REQUEST
      );
    }

    // const doctor = await this.doctorRepo.findByUserId(userId);
    // if (!doctor) {
    //   throw new AppError(
    //     MESSAGES.DOCTOR_PROFILE_NOT_FOUND ?? "Doctor profile not found",
    //     StatusCode.NOT_FOUND
    //   );
    // }
const doctor = await this.doctorRepo.findByUserId(userId);

// ✅ Return null if not exists (NO ERROR)
return {
  doctor: doctor ? DoctorMapper.toResponse(doctor) : null,
};
  //   return {
  //     doctor,
  //     message:
  //       MESSAGES.DOCTOR_PROFILE_FETCHED ??
  //       "Doctor profile fetched successfully",
  //   };
  // }
}
}
