import { Response } from "express";
import { CreateDoctorScheduleUseCase } from "../../application/usecases/schedule/CreateDoctorScheduleUseCase";
import { StatusCode } from "@common/enums";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { GetDoctorSlotsWithBookingUseCase } from "@application/usecases/schedule/GetDoctorSlotsWithBookingUseCase";
import { catchAsync } from "../utils/catchAsync";
import { DoctorMapper } from "../mappers/doctor/DoctorMapper";

export class DoctorScheduleController {
  constructor(
    private readonly createUseCase: CreateDoctorScheduleUseCase,
    private readonly getSlotsWithBookingUseCase: GetDoctorSlotsWithBookingUseCase
  ) {}

  create = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toCreateDoctorScheduleDTO(req);
    const schedule = await this.createUseCase.execute(dto);
    const output = DoctorMapper.toScheduleResponse(schedule);

    res.status(StatusCode.CREATED).json(output);
  });

  getSlotsWithBooking = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toGetSlotsWithBookingDTO(req);
    const domainSlots = await this.getSlotsWithBookingUseCase.execute(dto);
    const data = domainSlots.map(s => DoctorMapper.toSlotWithBookingResponse(s));

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(StatusCode.OK).json(data);
  });
}
