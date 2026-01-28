// import { v4 as uuid } from "uuid";
// import { DoctorSchedule } from "../../../domain/entities/DoctorSchedule";
// import { IDoctorScheduleRepository } from "../../../domain/interfaces/IDoctorScheduleRepository";
// import { RRulePolicy } from "../../../domain/policies/RRulePolicy";
// import { CreateDoctorScheduleInputDTO } from "../../dtos/doctorSchedule/CreateDoctorScheduleInputDTO";
// import { DoctorScheduleOutputDTO } from "../../dtos/doctorSchedule/DoctorScheduleOutputDTO";

// export class CreateDoctorScheduleUseCase {
//   constructor(
//     private readonly repo: IDoctorScheduleRepository,
//     private readonly rrulePolicy: RRulePolicy
// ) {}

//   async execute(dto: CreateDoctorScheduleInputDTO): Promise<DoctorScheduleOutputDTO> {
//     this.rrulePolicy.validate(dto.rrule);

//     const schedule = new DoctorSchedule(
//       uuid(),
//       dto.doctorId,
//       dto.rrule,
//       dto.startTime,
//       dto.endTime,
//       dto.slotDuration,
//       new Date(dto.validFrom),
//       new Date(dto.validTo),
//       dto.timezone ?? "Asia/Kolkata"
//     );

//     const saved = await this.repo.save(schedule);

//     // 🔁 Domain → Output DTO mapping
//     return {
//       id: saved.id,
//       doctorId: saved.doctorId,
//       rrule: saved.rrule,
//       startTime: saved.startTime,
//       endTime: saved.endTime,
//       slotDuration: saved.slotDuration,
//       validFrom: saved.validFrom.toISOString(),
//       validTo: saved.validTo.toISOString(),
//       timezone: saved.timezone
//     };
//   }
// }
// import { v4 as uuid } from "uuid";
// import { DoctorSchedule } from "../../../domain/entities/DoctorSchedule";
// import { IDoctorScheduleRepository } from "../../../domain/interfaces/IDoctorScheduleRepository";
// import { RRulePolicy } from "../../../domain/policies/RRulePolicy";
// import { CreateDoctorScheduleInputDTO } from "../../dtos/doctorSchedule/CreateDoctorScheduleInputDTO";
// import { DoctorScheduleOutputDTO } from "../../dtos/doctorSchedule/DoctorScheduleOutputDTO";
// import { InvalidDoctorScheduleError } from "../../../domain/errors/InvalidDoctorScheduleError";

// export class CreateDoctorScheduleUseCase {
//   constructor(
//     private readonly repo: IDoctorScheduleRepository,
//     private readonly rrulePolicy: RRulePolicy
//   ) {}

//   async execute(
//     dto: CreateDoctorScheduleInputDTO
//   ): Promise<DoctorScheduleOutputDTO> {

//     // 1️⃣ Validate RRULE (domain policy)
//     this.rrulePolicy.validate(dto.rrule);

//     // 2️⃣ Validate dates BEFORE entity creation
//     const validFrom = new Date(dto.validFrom);
//     const validTo = new Date(dto.validTo);

//     if (isNaN(validFrom.getTime()) || isNaN(validTo.getTime())) {
//       throw new InvalidDoctorScheduleError(
//         "validFrom and validTo must be valid dates"
//       );
//     }

//     if (validFrom > validTo) {
//       throw new InvalidDoctorScheduleError(
//         "validFrom must be before validTo"
//       );
//     }

//     // 3️⃣ Create domain entity (now safe)
//     const schedule = new DoctorSchedule(
//       uuid(),
//       dto.doctorId,
//       dto.rrule,
//       dto.startTime,
//       dto.endTime,
//       dto.slotDuration,
//       validFrom,
//       validTo,
//       dto.timezone ?? "Asia/Kolkata"
//     );

//     // 4️⃣ Persist
//     const saved = await this.repo.save(schedule);

//     // 5️⃣ Map to output DTO
//     return {
//       id: saved.id,
//       doctorId: saved.doctorId,
//       rrule: saved.rrule,
//       startTime: saved.startTime,
//       endTime: saved.endTime,
//       slotDuration: saved.slotDuration,
//       validFrom: saved.validFrom.toISOString(),
//       validTo: saved.validTo.toISOString(),
//       timezone: saved.timezone
//     };
//   }
// }
import { v4 as uuid } from "uuid";
import { DoctorSchedule } from "../../../domain/entities/DoctorSchedule";
import { IDoctorScheduleRepository } from "../../../domain/interfaces/IDoctorScheduleRepository";
import { RRulePolicy } from "../../../domain/policies/RRulePolicy";
import { CreateDoctorScheduleInputDTO } from "../../dtos/doctorSchedule/CreateDoctorScheduleInputDTO";
import { DoctorScheduleOutputDTO } from "../../dtos/doctorSchedule/DoctorScheduleOutputDTO";
import { InvalidDoctorScheduleError } from "../../../domain/errors/InvalidDoctorScheduleError";

export class CreateDoctorScheduleUseCase {
  constructor(
    private readonly repo: IDoctorScheduleRepository,
    private readonly rrulePolicy: RRulePolicy
  ) {}

  async execute(
    dto: CreateDoctorScheduleInputDTO
  ): Promise<DoctorScheduleOutputDTO> {

    /* ─────────────────────────────
       1️⃣ Validate RRULE (domain rule)
       ───────────────────────────── */
    this.rrulePolicy.validate(dto.rrule);

    /* ─────────────────────────────
       2️⃣ Validate slot duration
       ───────────────────────────── */
    if (
      typeof dto.slotDuration !== "number" ||
      dto.slotDuration <= 0
    ) {
      throw new InvalidDoctorScheduleError(
        "slotDuration must be a positive number"
      );
    }

    /* ─────────────────────────────
       3️⃣ Validate dates
       ───────────────────────────── */
    const validFrom = new Date(dto.validFrom);
    const validTo = new Date(dto.validTo);

    if (Number.isNaN(validFrom.getTime())) {
      throw new InvalidDoctorScheduleError("validFrom is invalid");
    }

    if (Number.isNaN(validTo.getTime())) {
      throw new InvalidDoctorScheduleError("validTo is invalid");
    }

    if (validFrom > validTo) {
      throw new InvalidDoctorScheduleError(
        "validFrom must be before validTo"
      );
    }

    /* ─────────────────────────────
       4️⃣ Create domain entity
       ───────────────────────────── */
    const schedule = new DoctorSchedule(
  uuid(),
  dto.doctorId,
  dto.rrule,
  dto.timeWindows,        // ✅ FIX
  dto.slotDuration,
  validFrom,
  validTo,
  dto.timezone ?? "Asia/Kolkata"
);

    /* ─────────────────────────────
       5️⃣ Persist (replace existing)
       ───────────────────────────── */
    const saved = await this.repo.save(schedule);

    /* ─────────────────────────────
       6️⃣ Map → Output DTO
       ───────────────────────────── */
    return {
  id: saved.id,
  doctorId: saved.doctorId,
  rrule: saved.rrule,
  timeWindows: saved.timeWindows,   // ✅ FIX
  slotDuration: saved.slotDuration,
  validFrom: saved.validFrom.toISOString(),
  validTo: saved.validTo.toISOString(),
  timezone: saved.timezone,
};

}
}