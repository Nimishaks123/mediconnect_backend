import { IPublicQueryRepository } from "@application/interfaces/queries/IPublicQueryRepository";
import { PlatformStatsDTO } from "@application/dtos/public/PlatformStatsDTO";
import { DoctorModel } from "./models/DoctorModel";
import { UserModel } from "./models/UserModel";
import { AppointmentModel } from "./models/AppointmentModel";
import { DoctorVerificationStatus } from "@domain/enums/DoctorVerificationStatus";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";

export class PublicQueryRepository implements IPublicQueryRepository {
  async getPlatformStats(): Promise<PlatformStatsDTO> {
    const verifiedDoctorsFilter = { verificationStatus: DoctorVerificationStatus.APPROVED };

    const [verifiedDoctors, registeredPatients, completedAppointments, uniqueSpecialtiesList] = await Promise.all([
      DoctorModel.countDocuments(verifiedDoctorsFilter),
      UserModel.countDocuments({ role: "PATIENT" }),
      AppointmentModel.countDocuments({ status: AppointmentStatus.COMPLETED }),
      DoctorModel.distinct("specialty", {
        ...verifiedDoctorsFilter,
        specialty: { $nin: [null, ""] }
      })
    ]);

    return {
      verifiedDoctors,
      registeredPatients,
      completedAppointments,
      medicalSpecialties: uniqueSpecialtiesList.length,
    };
  }
}
