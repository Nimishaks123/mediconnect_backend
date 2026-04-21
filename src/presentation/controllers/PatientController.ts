import { Response } from "express";
import { StatusCode } from "@common/enums";
//import { AppError } from "@common/AppError";
import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { catchAsync } from "../utils/catchAsync";
import { PatientMapper } from "../mappers/patient/PatientMapper";
import { ICreatePatientProfileUseCase } from "@application/interfaces/patient/ICreatePatientProfileUseCase";
import { IGetPatientProfileUseCase } from "@application/interfaces/patient/IGetPatientProfileUseCase";
import { IUpdatePatientProfileUseCase } from "@application/interfaces/patient/IUpdatePatientProfileUseCase";

export class PatientController {
  constructor(
    private readonly createProfileUC: ICreatePatientProfileUseCase,
    private readonly getProfileUC: IGetPatientProfileUseCase,
    private readonly updateProfileUC: IUpdatePatientProfileUseCase,
  ) { }

  createProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const userId = req.user!.id;
    const result = await this.createProfileUC.execute({
      ...req.body,
      userId,
    });

    const response = {
      message: result.message,
      patient: PatientMapper.toResponse(result.patient)
    };

    res.status(StatusCode.CREATED).json(response);
  });

  getProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const userId = req.user!.id;

    // Disable caching for sensitive profile data
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    const result = await this.getProfileUC.execute({ userId });

    if (!result.patient) {
      res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: "Patient profile not found"
      });
      return;
    }

    const response = PatientMapper.toProfileResponse(result.user, result.patient);
    res.status(StatusCode.OK).json(response);
  });

  updateProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const userId = req.user!.id;
    const result = await this.updateProfileUC.execute({
      userId,
      updates: {
        ...req.body,
        dateOfBirth: req.body.dateOfBirth,
      },
    });

    const response = {
      message: result.message,
      patient: PatientMapper.toResponse(result.patient)
    };

    res.status(StatusCode.OK).json(response);
  });
}

