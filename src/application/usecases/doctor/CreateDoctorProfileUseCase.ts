import { ICreateDoctorProfileUseCase } from "@application/interfaces/doctor/ICreateDoctorProfileUseCase";
import { CreateDoctorProfileDTO, CreateDoctorProfileResponseDTO } from "@application/dtos/doctor/CreateDoctorProfileDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DoctorMapper } from "@application/mappers/DoctorMapper";

export class CreateDoctorProfileUseCase implements ICreateDoctorProfileUseCase {
  constructor(private readonly doctorRepo: IDoctorRepository) {}

  async execute(input: CreateDoctorProfileDTO): Promise<CreateDoctorProfileResponseDTO> {
    const doctor = await this.doctorRepo.findByUserId(input.userId);
    if (!doctor) {
      throw new AppError(
        MESSAGES.DOCTOR_ONBOARDING_NOT_STARTED ?? "Doctor onboarding not started",
        StatusCode.BAD_REQUEST
      );
    }

    const trimmedRegNumber = input.registrationNumber.trim().toUpperCase();
    
    // Check uniqueness of registration number
    const existingReg = await this.doctorRepo.findOneByRegistrationNumber(trimmedRegNumber);
    if (existingReg && existingReg.getUserId() !== input.userId) {
      throw new AppError("Registration number already exists", StatusCode.BAD_REQUEST);
    }

    doctor.updateBasicInfo({
      specialty: input.specialty.trim(),
      qualification: input.qualification.trim(),
      experience: input.experience,
      consultationFee: input.consultationFee,
      registrationNumber: trimmedRegNumber,
      aboutMe: input.aboutMe.trim(),
    });

    const updated = await this.doctorRepo.save(doctor);

    return {
      doctor: DoctorMapper.toResponse(updated),
      message: MESSAGES.DOCTOR_BASIC_PROFILE_CREATED ?? "Doctor basic profile created successfully",
    };
  }
}
