import { Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { AppError } from "@common/AppError";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { catchAsync } from "../utils/catchAsync";
import { DoctorMapper } from "../mappers/doctor/DoctorMapper";
import {
  StartOnboardingSchema,
  CreateDoctorProfileSchema,
  UpdateDoctorProfileSchema,
  UploadDoctorDocumentsSchema,
  SubmitForVerificationSchema,
  GetDoctorProfileSchema
} from "../validators/doctor.validator";

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
  ) {}

  // START ONBOARDING
  startOnboarding = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const validated = StartOnboardingSchema.parse({
      userId: req.user.id,
    });
    const result = await this.startOnboardingUC.execute(validated);

    logger.info("Doctor onboarding started", { userId: validated.userId });
    res.status(StatusCode.OK).json(result);
  });

  // CREATE PROFILE
  createProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const validated = CreateDoctorProfileSchema.parse({
      ...req.body,
      userId: req.user.id,
    });
    const result = await this.createProfileUC.execute(validated);

    logger.info("Doctor profile created", { userId: validated.userId });
    res.status(StatusCode.CREATED).json(result);
  });
  // UPDATE PROFILE
  updateProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const validated = UpdateDoctorProfileSchema.parse({
      userId: req.user.id,
      updates: req.body,
    });
    const result = await this.updateProfileUC.execute(validated);

    logger.info("Doctor profile updated", { userId: validated.userId });
    res.status(StatusCode.OK).json(result);
  });

  // UPLOAD DOCUMENTS
  uploadDocuments = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const validated = UploadDoctorDocumentsSchema.parse({
      userId: req.user.id,
      files: req.files || {},
      profilePhotoUrl: req.body.profilePhotoUrl,
    });
    const result = await this.uploadDocumentsUC.execute(validated);

    logger.info("Doctor documents uploaded", { userId: validated.userId });
    
    //  presentation-layer mapping
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
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const validated = SubmitForVerificationSchema.parse({
      userId: req.user.id,
    });
    const result = await this.submitForVerificationUC.execute(validated);

    logger.info("Doctor submitted for verification", { userId: validated.userId });
    res.status(StatusCode.OK).json(result);
  });

  // GET PROFILE
  getProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", StatusCode.UNAUTHORIZED);
    }

    const validated = GetDoctorProfileSchema.parse({
      userId: req.user.id,
    });
    const result = await this.getDoctorProfileUC.execute(validated);

    logger.info("Doctor profile fetched", { userId: validated.userId });
    res.status(StatusCode.OK).json(result);
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
