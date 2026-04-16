import { Response } from "express";
import { ICheckCallEligibilityUseCase } from "../../application/interfaces/appointment/ICheckCallEligibilityUseCase";
import { StatusCode } from "@common/enums";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "@common/AppError";
import { CheckCallEligibilitySchema } from "../validators/call.validator";

export class CallController {
  constructor(
    private readonly checkCallEligibilityUseCase: ICheckCallEligibilityUseCase
  ) {}

  checkEligibility = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const validated = CheckCallEligibilitySchema.parse({
      appointmentId: req.params.appointmentId,
      userId: req.user.id,
    });

    const isEligible = await this.checkCallEligibilityUseCase.execute(validated.appointmentId, validated.userId);

    if (!isEligible) {
      throw new AppError("You are not authorized to join this call.", StatusCode.FORBIDDEN);
    }

    res.status(StatusCode.OK).json({ eligible: true });
  });
}
