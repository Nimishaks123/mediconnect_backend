import { Response } from "express";
import { StatusCode } from "@common/enums";
import { AppError } from "@common/AppError";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { catchAsync } from "../utils/catchAsync";
import { DoctorMapper } from "../mappers/doctor/DoctorMapper";
import { ICreateDoctorScheduleUseCase } from "@application/interfaces/schedule/ICreateDoctorScheduleUseCase";
import { IGetDoctorSlotsWithBookingUseCase } from "@application/interfaces/schedule/IGetDoctorSlotsWithBookingUseCase";
import {
  CreateDoctorScheduleSchema,
  GetSlotsWithBookingSchema
} from "../validators/doctorSchedule.validator";
import { DoctorSlotWithBookingDTO } from "@application/dtos/appointment/DoctorSlotWithBookingDTO";

export class DoctorScheduleController {
  constructor(
    private readonly createUseCase: ICreateDoctorScheduleUseCase,
    private readonly getSlotsWithBookingUseCase: IGetDoctorSlotsWithBookingUseCase
  ) {}

  create = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = CreateDoctorScheduleSchema.parse({
      doctorId: req.user.id,
      rrule: req.body.rrule,
      timeWindows: req.body.timeWindows,
      slotDuration: req.body.slotDuration,
      validFrom: req.body.validFrom,
      validTo: req.body.validTo,
      timezone: req.body.timezone || 'UTC',
    });

    const schedule = await this.createUseCase.execute(dto);
    const output = DoctorMapper.toScheduleResponse(schedule);

    res.status(StatusCode.CREATED).json(output);
  });

  getSlotsWithBooking = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = GetSlotsWithBookingSchema.parse({
      doctorUserId: req.user.id,
      from: req.query.from,
      to: req.query.to,
    });

    const domainSlots: DoctorSlotWithBookingDTO[] = await this.getSlotsWithBookingUseCase.execute(dto);
    const data = domainSlots.map((s: DoctorSlotWithBookingDTO) => DoctorMapper.toSlotWithBookingResponse(s));

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(StatusCode.OK).json(data);
  });
}
