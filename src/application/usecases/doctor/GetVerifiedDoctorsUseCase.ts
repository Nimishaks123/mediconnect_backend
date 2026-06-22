import { IGetVerifiedDoctorsUseCase } from "@application/interfaces/doctor/IGetVerifiedDoctorsUseCase";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { VerifiedDoctorResponseDTO } from "@application/dtos/doctor/VerifiedDoctorResponseDTO";
import { DoctorMapper } from "@application/mappers/DoctorMapper";
import { AppError } from "@common/AppError";
import { GetVerifiedDoctorsDTO } from "@application/dtos/doctor/GetVerifiedDoctorsDTO";
import { StatusCode } from "@common/enums";

export class GetVerifiedDoctorsUseCase implements IGetVerifiedDoctorsUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto:GetVerifiedDoctorsDTO): Promise<{doctors:VerifiedDoctorResponseDTO[];total:number;}> {
    const result=await this.doctorRepo.findVerifiedDoctors(dto);
    const doctors = result.doctors;
    const total=result.total;

    if (doctors.length === 0) {
      return {
        doctors:[],
        total:0
      };
    }
    const userIds = doctors.map((d) => d.getUserId());
    const users = await this.userRepo.findByIds(userIds);

    const userMap = new Map(users.map((u) => [u.getId(), u]));
    const mappedDoctors=doctors.map(doctor=>{
      const user=userMap.get(doctor.getUserId());
      if(!doctor.getId()){
        throw new AppError("Invariant violation:doctor must have an id",StatusCode.INTERNAL_ERROR);
      }
      return DoctorMapper.toVerifiedDoctorResponse(doctor,user);
    });
    return{
      doctors:mappedDoctors,
      total
    };
  }
}

    