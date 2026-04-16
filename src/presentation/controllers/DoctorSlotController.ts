import { StatusCode } from "@common/enums";
import { Response } from "express";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { AppError } from "../../common/AppError";
import { catchAsync } from "../utils/catchAsync";
import { DoctorMapper } from "../mappers/doctor/DoctorMapper";
import { IGenerateDoctorSlotsUseCase } from "@application/interfaces/schedule/IGenerateDoctorSlotsUseCase";
import { IDeleteDoctorSlotUseCase } from "@application/interfaces/schedule/IDeleteDoctorSlotUseCase";
import {
  GetDoctorSlotsSchema,
  GetSlotsForPatientSchema,
  DeleteSlotSchema
} from "../validators/doctorSlot.validator";
import { Slot } from "@domain/entities/Slot";

export class DoctorSlotController {
  constructor(
    private readonly generateSlotsUseCase: IGenerateDoctorSlotsUseCase,
    private readonly deleteDoctorSlotUseCase: IDeleteDoctorSlotUseCase
  ) {}

  // Doctor → view own slots
  getDoctorSlots = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
   ) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = GetDoctorSlotsSchema.parse({
      doctorId: req.user.id,
      from: req.query.from,
      to: req.query.to,
    });

    const domainSlots: Slot[] = await this.generateSlotsUseCase.execute(dto);

    // Map domain entities to response DTOs
    const slots = domainSlots.map((s: Slot) => DoctorMapper.toSlotResponse(s));

    res.status(StatusCode.OK).json(slots);
  });

  getSlotsForPatient = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    // Disable caching for patient slots
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const dto = GetSlotsForPatientSchema.parse({
      doctorId: req.params.doctorId,
      from: req.query.from,
      to: req.query.to,
    });

    const domainSlots: Slot[] = await this.generateSlotsUseCase.execute(dto);

    // Map domain entities to response DTOs
    const slots = domainSlots.map((s: Slot) => DoctorMapper.toSlotResponse(s));

    res.status(StatusCode.OK).json(slots);
  });

  deleteSlotController = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = DeleteSlotSchema.parse({
      slotId: req.params.slotId,
      doctorUserId: req.user.id,
    });

    await this.deleteDoctorSlotUseCase.execute(dto);

    res.status(StatusCode.OK).json({ success: true, message: "Slot deleted successfully" });
  });
}
