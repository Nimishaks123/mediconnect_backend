
import { DoctorSchedule } from "@domain/entities/DoctorSchedule";
import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
import { IRRulePolicy } from "@domain/policies/IRRulePolicy";
import { CreateDoctorScheduleInputDTO } from "@application/dtos/doctorSchedule/CreateDoctorScheduleInputDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";

export class CreateDoctorScheduleUseCase {
  constructor(
    private readonly repo: IDoctorScheduleRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly rrulePolicy: IRRulePolicy
  ) {}


async execute(dto: CreateDoctorScheduleInputDTO): Promise<DoctorSchedule> {
  this.rrulePolicy.validate(dto.rrule);

  const doctor = await this.doctorRepository.findByUserId(dto.doctorId);
  if (!doctor) {
    throw new AppError(
      MESSAGES.DOCTOR_PROFILE_NOT_FOUND,
      StatusCode.NOT_FOUND
    );
  }
  // const now=new Date();
  // const validFromDate=new Date(dto.validFrom);
  // if(validFromDate<now){
  //   throw new AppError("Schedule cannot start in the past",StatusCode.BAD_REQUEST);
  // }
  const today = new Date();

today.setHours(0, 0, 0, 0);

const validFromDate =
  new Date(dto.validFrom);

validFromDate.setHours(0, 0, 0, 0);

if (validFromDate < today) {
  throw new AppError(
    "Schedule cannot start in the past",
    StatusCode.BAD_REQUEST
  );
}
// const validToDate=new Date(dto.validTo);
// if(validToDate<=validFromDate){
//   throw new AppError("validTo must be after validFrom",StatusCode.BAD_REQUEST);
// }
const validToDate =
  new Date(dto.validTo);

validToDate.setHours(0,0,0,0);

if (validToDate <= validFromDate) {
  throw new AppError(
    "validTo must be after validFrom",
    StatusCode.BAD_REQUEST
  );
}
//validate timewindows
dto.timeWindows.forEach((window)=>{
  if(window.end<=window.start){
    throw new AppError("End time must be after start time",StatusCode.BAD_REQUEST);
  }
})
  const schedule = DoctorSchedule.create({
    ...dto,
    doctorId: doctor.getId(),
  });

  const existing = await this.repo.findByDoctorId(doctor.getId());
  const existingId = existing?.getId();

  try {
    if (existingId) {
  await this.repo.deleteById(existingId);
}

    return await this.repo.save(schedule);
  } catch (error:any) {
    throw new AppError(
    error.message || "Failed to create doctor schedule",
    StatusCode.INTERNAL_ERROR
  );
  }
}
}