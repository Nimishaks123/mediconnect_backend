import { IUpdateDoctorProfileUseCase } from "@application/interfaces/doctor/IUpdateDoctorProfileUseCase";
import { UpdateDoctorProfileDTO, UpdateDoctorProfileResponseDTO } from "@application/dtos/doctor/UpdateDoctorProfileDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DoctorMapper } from "@application/mappers/DoctorMapper";

export class UpdateDoctorProfileUseCase implements IUpdateDoctorProfileUseCase {
  constructor(private readonly doctorRepo: IDoctorRepository) {}

  async execute(input: UpdateDoctorProfileDTO): Promise<UpdateDoctorProfileResponseDTO> {
    const { userId, updates } = input;

    const existing = await this.doctorRepo.findByUserId(userId);
    if (!existing) {
      throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    // PART 5: Sensitive Document Lock
    // Only specialty, qualification, experience, fee, and about me can be updated via this usecase.
    // License and certs are handled via specialized upload flow.
    const forbiddenFields = ['licenseDocument', 'certifications'];
    const attemptedForbidden = Object.keys(updates).filter(key => forbiddenFields.includes(key));
    if (attemptedForbidden.length > 0) {
      throw new AppError("Professional documents cannot be edited directly after submission.", StatusCode.BAD_REQUEST);
    }

    // Sanitize and validate business rules
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.specialty) sanitizedUpdates.specialty = sanitizedUpdates.specialty.trim();
    if (sanitizedUpdates.qualification) sanitizedUpdates.qualification = sanitizedUpdates.qualification.trim();
    if (sanitizedUpdates.registrationNumber) {
      sanitizedUpdates.registrationNumber = sanitizedUpdates.registrationNumber.trim().toUpperCase();
      
      // Optional: Check uniqueness if registration number changed
      if (sanitizedUpdates.registrationNumber !== existing.registrationNumber) {
        const duplicate = await this.doctorRepo.findOneByRegistrationNumber(sanitizedUpdates.registrationNumber);
        if (duplicate) {
          throw new AppError("Registration number already exists", StatusCode.BAD_REQUEST);
        }
      }
    }
    if (sanitizedUpdates.aboutMe) sanitizedUpdates.aboutMe = sanitizedUpdates.aboutMe.trim();
    
    // PART 4: Profile Photo Logic (Direct URL)
    if (sanitizedUpdates.profilePhoto) {
      if (!sanitizedUpdates.profilePhoto.includes("res.cloudinary.com")) {
        throw new AppError("Invalid profile photo URL. Only internal Cloudinary URLs are allowed.", StatusCode.BAD_REQUEST);
      }
      existing.updateProfilePhoto(sanitizedUpdates.profilePhoto);
    }

    existing.updateProfile(sanitizedUpdates);
    
   
    existing.advanceOnboardingStep();

    const updated = await this.doctorRepo.save(existing);

    return {
      doctor: DoctorMapper.toResponse(updated),
      message: MESSAGES.DOCTOR_PROFILE_UPDATED,
    };
  }
}
