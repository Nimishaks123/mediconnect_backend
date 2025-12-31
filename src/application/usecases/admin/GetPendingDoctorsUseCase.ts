// // src/application/usecases/admin/GetPendingDoctorsUseCase.ts

// import { IGetPendingDoctorsUseCase } from "@application/interfaces/admin/IGetPendingDoctorsUseCase";
// import { GetPendingDoctorsOutputDTO } from "@application/dtos/admin/GetPendingDoctorsOutputDTO";
// import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
// import { IUserRepository } from "@domain/interfaces/IUserRepository";

// export class GetPendingDoctorsUseCase implements IGetPendingDoctorsUseCase {
//   constructor(
//     private readonly doctorRepo: IDoctorRepository,
//     private readonly userRepo: IUserRepository
//   ) {}

//   async execute(): Promise<GetPendingDoctorsOutputDTO> {
//     const pendingDoctors = await this.doctorRepo.findDoctors({
//       verificationStatus: "PENDING",
//     });

//     const dtoDoctors = await Promise.all(
//       pendingDoctors.map(async (d) => {
//         const user = await this.userRepo.findById(d.userId);

//         return {
//           doctor: {
//             id: d.id ?? "",
//             userId: d.userId,
//             specialty: d.specialty,
//             qualification: d.qualification,
//             experience: d.experience,
//             consultationFee: d.consultationFee,
//             registrationNumber: d.registrationNumber,
//             licenseDocument: d.licenseDocument ?? null,
//             certifications: d.certifications ?? [],
//             aboutMe: d.aboutMe ?? "",
//             profilePhoto: d.profilePhoto ?? null,
//             onboardingStatus: d.onboardingStatus,
//             verificationStatus: d.verificationStatus,

//             // 🔥 FIX: return Date | null
//             verifiedBy: d.verifiedBy ?? null,
//             verifiedAt: d.verifiedAt ?? null,

//             rejectionReason: d.rejectionReason ?? null,
//           },

//           user: user
//             ? {
//                 id: user.id ?? "",
//                 name: user.name,
//                 email: user.email,
//                role: user.role as "PATIENT" | "DOCTOR" | "ADMIN",
//                 blocked: user.blocked,
//                 isVerified: user.isVerified,
//               }
//             : {
//                 id: "",
//                 name: "",
//                 email: "",
//                 role: "DOCTOR",
//                 blocked: false,
//                 isVerified: false,
//               },
//         };
//       })
//     );

//     return {
//       count: dtoDoctors.length,
//       doctors: dtoDoctors,
//     };
//   }
// }
import { IGetPendingDoctorsUseCase } from "@application/interfaces/admin/IGetPendingDoctorsUseCase";
import { GetPendingDoctorsOutputDTO } from "@application/dtos/admin/GetPendingDoctorsOutputDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { Doctor } from "@domain/entities/Doctor";
import { DoctorVerificationStatus } from "@domain/enums/DoctorVerificationStatus";
import { UserRole } from "@domain/enums/UserRole";

export class GetPendingDoctorsUseCase implements IGetPendingDoctorsUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(): Promise<GetPendingDoctorsOutputDTO> {
    const pendingDoctors: Doctor[] =
    await this.doctorRepo.findByVerificationStatus(
  DoctorVerificationStatus.PENDING
);


    const dtoDoctors = await Promise.all(
      pendingDoctors.map(async (d: Doctor) => {
        const user = await this.userRepo.findById(d.userId);

        return {
          doctor: {
            id: d.id ?? "",
            userId: d.userId,
            specialty: d.specialty,
            qualification: d.qualification,
            experience: d.experience,
            consultationFee: d.consultationFee,
            registrationNumber: d.registrationNumber,
            licenseDocument: d.licenseDocument ?? null,
            certifications: d.certifications ?? [],
            aboutMe: d.aboutMe ?? "",
            profilePhoto: d.profilePhoto ?? null,
            onboardingStatus: d.onboardingStatus,
            verificationStatus: d.verificationStatus,
            verifiedBy: d.verifiedBy ?? null,
            verifiedAt: d.verifiedAt ?? null,
            rejectionReason: d.rejectionReason ?? null,
          },
          user: user
            ? {
                id: user.id ?? "",
                name: user.name,
                email: user.email,
                role: user.role,
                blocked: user.blocked,
                isVerified: user.isVerified,
              }
            : {
                id: "",
                name: "",
                email: "",
                role: UserRole.DOCTOR,
                blocked: false,
                isVerified: false,
              },
        };
      })
    );

    return {
      count: dtoDoctors.length,
      doctors: dtoDoctors,
    };
  }
}
