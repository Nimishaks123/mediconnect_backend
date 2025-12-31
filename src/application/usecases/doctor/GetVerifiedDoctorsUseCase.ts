import { IGetVerifiedDoctorsUseCase } from "@application/interfaces/doctor/IGetVerifiedDoctorsUseCase";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { Doctor } from "@domain/entities/Doctor";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { VerifiedDoctorResponseDTO } from "@application/dtos/doctor/VerifiedDoctorResponseDTO";
import {MESSAGES} from "../../../common/constants";
export class GetVerifiedDoctorsUseCase
  implements IGetVerifiedDoctorsUseCase
{
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo:IUserRepository
  ) {}

  async execute(): Promise<VerifiedDoctorResponseDTO[]> {
  const doctors = await this.doctorRepo.findVerifiedDoctors();

  return Promise.all(
    doctors.map(async (doctor) => {
      if (!doctor.id) {
        throw new Error("Invariant violation: Verified doctor has no ID");
      }

      const user = await this.userRepo.findById(doctor.userId);

      return {
        id: doctor.id, // now guaranteed string
        name: user?.name ?? "Doctor",
        specialty: doctor.specialty,
        about: doctor.aboutMe,
        photo: doctor.profilePhoto && doctor.profilePhoto.trim() !== ""
      ? doctor.profilePhoto
      :MESSAGES.DEFAULT_DOCTOR_AVATAR,
      };
    })
  );
}

}
