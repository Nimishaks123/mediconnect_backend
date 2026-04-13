import { IGetVerifiedDoctorsUseCase } from "@application/interfaces/doctor/IGetVerifiedDoctorsUseCase";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { VerifiedDoctorResponseDTO } from "@application/dtos/doctor/VerifiedDoctorResponseDTO";
import { DoctorMapper } from "@application/mappers/DoctorMapper";
import { AppError } from "@common/AppError";

export class GetVerifiedDoctorsUseCase implements IGetVerifiedDoctorsUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(): Promise<VerifiedDoctorResponseDTO[]> {
    const doctors = await this.doctorRepo.findVerifiedDoctors();

    if (doctors.length === 0) return [];
    const userIds = doctors.map((d) => d.getUserId());
    const users = await this.userRepo.findByIds(userIds);

    const userMap = new Map(users.map((u) => [u.id, u]));

    return doctors.map((doctor) => {
      const userId = doctor.getUserId();
      const user = userMap.get(userId);

      if (!doctor.getId()) {
        throw new AppError("Invariant violation: Doctor must have an ID", 500);
      }

      return DoctorMapper.toVerifiedDoctorResponse(doctor, user);
    });
  }
}
