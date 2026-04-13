import { IGetDoctorProfileUseCase } from "@application/interfaces/doctor/IGetDoctorProfileUseCase";
import { GetDoctorProfileDTO, GetDoctorProfileResponseDTO } from "@application/dtos/doctor/GetDoctorProfileDTO";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DoctorMapper } from "@application/mappers/DoctorMapper";

export class GetDoctorProfileUseCase implements IGetDoctorProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly doctorRepo: IDoctorRepository
  ) {}

  async execute(input: GetDoctorProfileDTO): Promise<GetDoctorProfileResponseDTO> {
    const { userId } = input;

 
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (!user.isDoctor()) {
      throw new AppError(
        MESSAGES.USER_NOT_DOCTOR ?? "User is not a doctor",
        StatusCode.BAD_REQUEST
      );
    }

    const doctor = await this.doctorRepo.findByUserId(userId);

    return {
      doctor: doctor ? DoctorMapper.toResponse(doctor) : null,
    };
  }
}
