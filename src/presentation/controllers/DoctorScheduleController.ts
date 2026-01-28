import { Response, NextFunction } from "express";
import { CreateDoctorScheduleUseCase } from "../../application/usecases/schedule/CreateDoctorScheduleUseCase";
import { StatusCode } from "@common/enums";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export class DoctorScheduleController {
  constructor(
    private readonly createUseCase: CreateDoctorScheduleUseCase
  ) {}

  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const output = await this.createUseCase.execute({
        doctorId: req.user.id,
        rrule: req.body.rrule,
        timeWindows: req.body.timeWindows, // ✅ FIX
        slotDuration: Number(req.body.slotDuration),
        validFrom: req.body.validFrom,
        validTo: req.body.validTo,
        timezone: req.body.timezone,
      });

      res.status(StatusCode.CREATED).json(output);
    } catch (error) {
      next(error);
    }
  }
}
