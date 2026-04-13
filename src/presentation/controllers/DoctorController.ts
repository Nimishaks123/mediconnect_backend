import { Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
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
  ) {}

  // =========================
  // START ONBOARDING
  // =========================
  startOnboarding = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toStartOnboardingDTO(req);
    const result = await this.startOnboardingUC.execute(dto);

    logger.info("Doctor onboarding started", { userId: dto.userId });
    res.status(StatusCode.OK).json(result);
  });

  // =========================
  // CREATE PROFILE
  // =========================
  createProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toCreateDoctorProfileDTO(req);
    const result = await this.createProfileUC.execute(dto);

    logger.info("Doctor profile created", { userId: dto.userId });
    res.status(StatusCode.CREATED).json(result);
  });

  // =========================
  // UPDATE PROFILE
  // =========================
  updateProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toUpdateDoctorProfileDTO(req);
    const result = await this.updateProfileUC.execute(dto);

    logger.info("Doctor profile updated", { userId: dto.userId });
    res.status(StatusCode.OK).json(result);
  });

  // =========================
  // UPLOAD DOCUMENTS
  // =========================
  uploadDocuments = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toUploadDoctorDocumentsDTO(req);
    const result = await this.uploadDocumentsUC.execute(dto);

    logger.info("Doctor documents uploaded", { userId: dto.userId });
    
    // Explicit presentation-layer mapping (UseCase returns raw entity)
    const response = {
      doctor: DoctorMapper.toResponse(result.doctor),
      message: result.message
    };

    res.status(StatusCode.OK).json(response);
  });

  // =========================
  // SUBMIT FOR VERIFICATION
  // =========================
  submitForVerification = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toSubmitForVerificationDTO(req);
    const result = await this.submitForVerificationUC.execute(dto);

    logger.info("Doctor submitted for verification", { userId: dto.userId });
    res.status(StatusCode.OK).json(result);
  });

  // =========================
  // GET PROFILE
  // =========================
  getProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response,
  ) => {
    const dto = DoctorMapper.toGetDoctorProfileDTO(req);
    const result = await this.getDoctorProfileUC.execute(dto);

    logger.info("Doctor profile fetched", { userId: dto.userId });
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
