// src/presentation/controllers/DoctorController.ts
import { Request, Response, NextFunction } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";

import {
  IStartDoctorOnboardingUseCase,
  ICreateDoctorProfileUseCase,
  IUpdateDoctorProfileUseCase,
  IUploadDoctorDocumentsUseCase,
  ISubmitForVerificationUseCase,
  IGetDoctorProfileUseCase,
  IGetVerifiedDoctorsUseCase
} from "@application/interfaces/doctor";

import {
  StartDoctorOnboardingDTO,
  CreateDoctorProfileDTO,
  UpdateDoctorProfileDTO,
  UploadDoctorDocumentsDTO,
  SubmitForVerificationDTO,
  GetDoctorProfileDTO,
} from "@application/dtos/doctor";

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
  startOnboarding = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: StartDoctorOnboardingDTO = {
        userId: (req as any).user.id,
      };

      const result = await this.startOnboardingUC.execute(dto);

      logger.info("Doctor onboarding started", { userId: dto.userId });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Start doctor onboarding failed");
      next(error);
    }
  };

  // =========================
  // CREATE PROFILE
  // =========================
  createProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: CreateDoctorProfileDTO = {
        userId: (req as any).user.id,
        specialty: req.body.specialty,
        qualification: req.body.qualification,
        experience: req.body.experience,
        consultationFee: req.body.consultationFee,
        registrationNumber: req.body.registrationNumber,
        aboutMe: req.body.aboutMe,
      };

      const result = await this.createProfileUC.execute(dto);

      logger.info("Doctor profile created", { userId: dto.userId });

      res.status(StatusCode.CREATED).json(result);
    } catch (error) {
      logger.error("Create doctor profile failed");
      next(error);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: UpdateDoctorProfileDTO = {
        userId: (req as any).user.id,
        updates: req.body,
      };

      const result = await this.updateProfileUC.execute(dto);

      logger.info("Doctor profile updated", { userId: dto.userId });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Update doctor profile failed");
      next(error);
    }
  };

  // =========================
  // UPLOAD DOCUMENTS
  // =========================
  uploadDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const files = req.files as {
        licenseDocument?: Express.Multer.File[];
        profilePhoto?: Express.Multer.File[];
        certifications?: Express.Multer.File[];
      };

      const dto: UploadDoctorDocumentsDTO = {
        userId: (req as any).user.id,
        files,
      };

      const result = await this.uploadDocumentsUC.execute(dto);

      logger.info("Doctor documents uploaded", { userId: dto.userId });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Upload doctor documents failed");
      next(error);
    }
  };

  // =========================
  // SUBMIT FOR VERIFICATION
  // =========================
  submitForVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: SubmitForVerificationDTO = {
        userId: (req as any).user.id,
      };

      const result = await this.submitForVerificationUC.execute(dto);

      logger.info("Doctor submitted for verification", { userId: dto.userId });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Submit doctor for verification failed");
      next(error);
    }
  };

  // =========================
  // GET PROFILE
  // =========================
  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: GetDoctorProfileDTO = {
        userId: (req as any).user.id,
      };

      const result = await this.getDoctorProfileUC.execute(dto);

      logger.info("Doctor profile fetched", { userId: dto.userId });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Get doctor profile failed");
      next(error);
    }
  };
  getVerifiedDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
     console.log("Controller hit: getVerifiedDoctors");
    const result =await this.getVerifiedDoctorsUC.execute();
        console.log("Result length:", result.length);
      res.setHeader("Cache-Control", "no-store"); // 🔥 IMPORTANT
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    logger.info("Verified doctors fetched", {
      count: result.length,
    });

    res.status(StatusCode.OK).json(result);
  } catch (error) {
    logger.error("Get verified doctors failed");
    next(error);
  }
};
}
