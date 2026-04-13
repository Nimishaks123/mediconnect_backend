import { StatusCode } from "@common/enums";
import { Response } from "express";
import { GenerateDoctorSlotsUseCase } from "../../application/usecases/schedule/GenerateDoctorSlotsUseCase";
import { DeleteDoctorSlotUseCase } from "../../application/usecases/schedule/DeleteDoctorSlotUseCase";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { AppError } from "../../common/AppError";
import { catchAsync } from "../utils/catchAsync";
import { DoctorMapper } from "../mappers/doctor/DoctorMapper";

export class DoctorSlotController {
  constructor(
    private readonly generateSlotsUseCase: GenerateDoctorSlotsUseCase,
    private readonly deleteDoctorSlotUseCase: DeleteDoctorSlotUseCase
  ) {}

  // Doctor → view own slots
  getDoctorSlots = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
   ) => {
    if (!req.query.from || !req.query.to) {
      throw new AppError("from and to dates are required", 400);
    }

    const dto = DoctorMapper.toGenerateSlotsDTO(req);
    const domainSlots = await this.generateSlotsUseCase.execute(
      dto.doctorId,               
      dto.from,
      dto.to
    );

    // ✅ Map domain entities to response DTOs
    const slots = domainSlots.map(s => DoctorMapper.toSlotResponse(s));

    res.status(StatusCode.OK).json(slots);
  });

  getSlotsForPatient = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.query.from || !req.query.to) {
      throw new AppError("from and to required", 400);
    }

    // Disable caching for patient slots
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const dto = DoctorMapper.toGetSlotsForPatientDTO(req);
    const domainSlots = await this.generateSlotsUseCase.execute(
      dto.doctorId,
      dto.from,
      dto.to
    );

    // ✅ Map domain entities to response DTOs
    const slots = domainSlots.map(s => DoctorMapper.toSlotResponse(s));

    res.status(StatusCode.OK).json(slots);
  });

  deleteSlotController = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const slotId = req.params.slotId;
    const doctorUserId = req.user.id;

    await this.deleteDoctorSlotUseCase.execute(slotId, doctorUserId);

    res.status(StatusCode.OK).json({ success: true, message: "Slot deleted successfully" });
  });
}
