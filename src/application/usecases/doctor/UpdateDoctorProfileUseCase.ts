import { IUpdateDoctorProfileUseCase } from "@application/interfaces/doctor/IUpdateDoctorProfileUseCase";
import { UpdateDoctorProfileDTO, UpdateDoctorProfileResponseDTO } from "@application/dtos/doctor/UpdateDoctorProfileDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IAdminRepository } from "@domain/interfaces/IAdminRepository";
import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enums/NotificationType";
import { DoctorOnboardingStatus } from "@domain/enums/DoctorOnboardingStatus";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DoctorMapper } from "@application/mappers/DoctorMapper";

export class UpdateDoctorProfileUseCase implements IUpdateDoctorProfileUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository,
    private readonly adminRepo: IAdminRepository,
    private readonly createNotificationUseCase: ICreateNotificationUseCase
  ) {}

  async execute(input: UpdateDoctorProfileDTO): Promise<UpdateDoctorProfileResponseDTO> {
    const { userId, updates } = input;

    const existing = await this.doctorRepo.findByUserId(userId);
    if (!existing) {
      throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const isAlreadyApproved = existing.getOnboardingStatus() === DoctorOnboardingStatus.APPROVED;

    const forbiddenFields = ['licenseDocument', 'certifications'];
    const attemptedForbidden = Object.keys(updates).filter(key => forbiddenFields.includes(key));
    if (attemptedForbidden.length > 0) {
      throw new AppError("Professional documents cannot be edited directly after submission.", StatusCode.BAD_REQUEST);
    }

    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.specialty) sanitizedUpdates.specialty = sanitizedUpdates.specialty.trim();
    if (sanitizedUpdates.qualification) sanitizedUpdates.qualification = sanitizedUpdates.qualification.trim();
    if (sanitizedUpdates.registrationNumber) {
      sanitizedUpdates.registrationNumber = sanitizedUpdates.registrationNumber.trim().toUpperCase();

      if (sanitizedUpdates.registrationNumber !== existing.getRegistrationNumber()) {
        const duplicate = await this.doctorRepo.findOneByRegistrationNumber(sanitizedUpdates.registrationNumber);
        if (duplicate) {
          throw new AppError("Registration number already exists", StatusCode.BAD_REQUEST);
        }
      }
    }
    if (sanitizedUpdates.aboutMe) sanitizedUpdates.aboutMe = sanitizedUpdates.aboutMe.trim();

    if (sanitizedUpdates.profilePhoto) {
      if (!sanitizedUpdates.profilePhoto.includes("res.cloudinary.com")) {
        throw new AppError("Invalid profile photo URL. Only internal Cloudinary URLs are allowed.", StatusCode.BAD_REQUEST);
      }
      existing.updateProfilePhoto(sanitizedUpdates.profilePhoto);
    }

    existing.updateProfile(sanitizedUpdates);
    existing.advanceOnboardingStep();

    const updated = await this.doctorRepo.save(existing);

    let userName = "";
    if (sanitizedUpdates.name) {
      const user = await this.userRepo.findById(userId);
      if (user) {
        user.updateName(sanitizedUpdates.name.trim());
        await this.userRepo.save(user);
        userName = user.getName();
      }
    } else {
      const user = await this.userRepo.findById(userId);
      if (user) {
        userName = user.getName();
      }
    }

    if (isAlreadyApproved) {
      const adminId = await this.adminRepo.findAdminId();
      if (adminId) {
        await this.createNotificationUseCase.execute({
          userId: adminId,
          title: "Doctor Profile Updated",
          message: `Dr. ${userName || "Doctor"} updated profile information requiring review.`,
          type: NotificationType.DOCTOR_PROFILE_UPDATED,
        });
      }
    }

    return {
      doctor: DoctorMapper.toResponse(updated),
      user: {
        id: userId,
        name: userName
      },
      message: MESSAGES.DOCTOR_PROFILE_UPDATED,
    };
  }
}
