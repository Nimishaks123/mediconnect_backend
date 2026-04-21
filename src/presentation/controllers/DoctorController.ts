import { Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
//import { AppError } from "@common/AppError";
import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { catchAsync } from "../utils/catchAsync";
import { DoctorMapper } from "../mappers/doctor/DoctorMapper";

import {
  IStartDoctorOnboardingUseCase,
  ICreateDoctorProfileUseCase,
  IUpdateDoctorProfileUseCase,
  IUploadDoctorDocumentsUseCase,
  ISubmitForVerificationUseCase,
  IGetDoctorProfileUseCase,
  IGetVerifiedDoctorsUseCase
} from "@application/interfaces/doctor";

export class DoctorController {
  constructor(
    private readonly startOnboardingUC: IStartDoctorOnboardingUseCase,
    private readonly createProfileUC: ICreateDoctorProfileUseCase,
    private readonly updateProfileUC: IUpdateDoctorProfileUseCase,
    private readonly uploadDocumentsUC: IUploadDoctorDocumentsUseCase,
    private readonly submitForVerificationUC: ISubmitForVerificationUseCase,
    private readonly getDoctorProfileUC: IGetDoctorProfileUseCase,
    private readonly getVerifiedDoctorsUC: IGetVerifiedDoctorsUseCase
  ) { }

  // START ONBOARDING
  startOnboarding = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const userId = req.user!.id;
    const result = await this.startOnboardingUC.execute({ userId });

    logger.info("Doctor onboarding started", { userId });
    res.status(StatusCode.OK).json(result);
  });

  // CREATE PROFILE
  createProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const userId = req.user!.id;
    const result = await this.createProfileUC.execute({
      ...req.body,
      userId,
    });

    logger.info("Doctor profile created", { userId });
    res.status(StatusCode.CREATED).json(result);
  });

  // UPDATE PROFILE
  updateProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const userId = req.user!.id;
    const result = await this.updateProfileUC.execute({
      userId,
      updates: req.body,
    });

    logger.info("Doctor profile updated", { userId });
    res.status(StatusCode.OK).json(result);
  });

  // UPLOAD DOCUMENTS
  uploadDocuments = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const userId = req.user!.id;
    const result = await this.uploadDocumentsUC.execute({
      userId,
      files: (req as any).files || {},
      profilePhotoUrl: req.body.profilePhotoUrl,
    });

    logger.info("Doctor documents uploaded", { userId });

    const response = {
      doctor: DoctorMapper.toResponse(result.doctor),
      message: result.message
    };

    res.status(StatusCode.OK).json(response);
  });

  // SUBMIT FOR VERIFICATION
  submitForVerification = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const userId = req.user!.id;
    const result = await this.submitForVerificationUC.execute({ userId });

    logger.info("Doctor submitted for verification", { userId });
    res.status(StatusCode.OK).json(result);
  });

  // GET PROFILE
  getProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const userId = req.user!.id;

    // Disable caching for sensitive profile data
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    // Auth middleware ensures req.user exists, Routes validate schema if needed
    const result = await this.getDoctorProfileUC.execute({ userId });

    if (!result.doctor) {
      res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: "Doctor profile not found"
      });
      return;
    }

    logger.info("Doctor profile fetched", { userId });
    res.status(StatusCode.OK).json({
      success: true,
      data: result.doctor,
      message: result.message
    });
  });


  getVerifiedDoctors = catchAsync(async (
    _req: AuthenticatedRequest,
    res: Response,
  ) => {
    const result = await this.getVerifiedDoctorsUC.execute();

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    logger.info("Verified doctors fetched", {
      count: result.length,
    });

    res.status(StatusCode.OK).json(result);
  });

}

