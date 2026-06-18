import { IDoctorRepository }
from "@domain/interfaces/IDoctorRepository";
import { IGetDoctorByIdUseCase }
from "@application/interfaces/doctor";
import { AppError }
from "@common/AppError";
import { IUserRepository }
from "@domain/interfaces/IUserRepository";
import { StatusCode }
from "@common/enums";

export class GetDoctorByIdUseCase implements IGetDoctorByIdUseCase{

  constructor(
    private readonly doctorRepo:
      IDoctorRepository,
      private readonly userRepo:
  IUserRepository
  ) {}

async execute(id: string) {

  const doctor =
    await this.doctorRepo.findById(id);

  if (!doctor) {
    throw new AppError(
      "Doctor not found",
      404
    );
  }

  const user =
    await this.userRepo.findById(
      doctor.getUserId()
    );

  return {

    id: doctor.getId(),

    name:
      user?.getName() ||
      "Doctor",

    email:
      user?.getEmail(),

    specialty:
      doctor.getSpecialty(),

    qualification:
      doctor.getQualification(),

    experience:
      doctor.getExperience(),

    consultationFee:
      doctor.getConsultationFee(),

    aboutMe:
      doctor.getAboutMe(),

    profilePhoto:
      doctor.getProfilePhoto(),

    verificationStatus:
      doctor.getVerificationStatus(),

  };
}
}