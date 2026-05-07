// import { DoctorSchedule } from "@domain/entities/DoctorSchedule";
// import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
// import { IRRulePolicy } from "@domain/policies/IRRulePolicy";
// import { CreateDoctorScheduleInputDTO } from "@application/dtos/doctorSchedule/CreateDoctorScheduleInputDTO";
// import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
// import { AppError } from "@common/AppError";
// import { MESSAGES } from "@common/constants";
// import { StatusCode } from "@common/enums";

// export class CreateDoctorScheduleUseCase {
//   constructor(
//     private readonly repo: IDoctorScheduleRepository,
//     private readonly doctorRepository: IDoctorRepository,
//     private readonly rrulePolicy: IRRulePolicy
//   ) { }


//   async execute(dto: CreateDoctorScheduleInputDTO): Promise<DoctorSchedule> {
//     this.rrulePolicy.validate(dto.rrule);
//     const doctor = await this.doctorRepository.findByUserId(dto.doctorId);
//     if (!doctor) {
//       throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
//     }

//     const schedule = DoctorSchedule.create({
//       ...dto,
//       doctorId: doctor.getId(),
//     });

//     // 🧱 Domain Policy: Replace overlapping schedules for the same doctor
//     const existingSchedules = await this.repo.findByDoctorId(doctor.getId());
    
//     for (const existing of existingSchedules) {
//       const isOverlapping = 
//         (schedule.validFrom <= existing.validTo && schedule.validTo >= existing.validFrom);
      
//       if (isOverlapping && existing.id) {
//         await this.repo.deleteById(existing.id);
//       }
//     }

//     // Persistence: Atomic aggregate save
//     return await this.repo.save(schedule);
//   }
// }
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

//   async execute(dto: CreateDoctorScheduleInputDTO): Promise<DoctorSchedule> {
//     // ✅ Validate RRULE
//     this.rrulePolicy.validate(dto.rrule);

//     // ✅ Ensure doctor exists
//     const doctor = await this.doctorRepository.findByUserId(dto.doctorId);
//     if (!doctor) {
//       throw new AppError(
//         MESSAGES.DOCTOR_PROFILE_NOT_FOUND,
//         StatusCode.NOT_FOUND
//       );
//     }

//     // ✅ Create new schedule domain entity
//     const schedule = DoctorSchedule.create({
//       ...dto,
//       doctorId: doctor.getId(),
//     });

//     // ✅ FIX: Only ONE schedule per doctor
//     const existing = await this.repo.findByDoctorId(doctor.getId());

//     // 🔥 Replace existing schedule (expired or active — doesn't matter)
//     if (existing && existing.getId()) {
//       await this.repo.deleteById(existing.getId());
//     }

//     // ✅ Save new schedule
//     return await this.repo.save(schedule);
//   }
// }
async execute(dto: CreateDoctorScheduleInputDTO): Promise<DoctorSchedule> {
  this.rrulePolicy.validate(dto.rrule);

  const doctor = await this.doctorRepository.findByUserId(dto.doctorId);
  if (!doctor) {
    throw new AppError(
      MESSAGES.DOCTOR_PROFILE_NOT_FOUND,
      StatusCode.NOT_FOUND
    );
  }

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