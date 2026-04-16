import { Response } from "express";
import { StatusCode } from "@common/enums";
import { AppError } from "@common/AppError";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { catchAsync } from "../utils/catchAsync";
import { PatientMapper } from "../mappers/patient/PatientMapper";
import { ICreatePatientProfileUseCase } from "@application/interfaces/patient/ICreatePatientProfileUseCase";
import { IGetPatientProfileUseCase } from "@application/interfaces/patient/IGetPatientProfileUseCase";
import { IUpdatePatientProfileUseCase } from "@application/interfaces/patient/IUpdatePatientProfileUseCase";
import {
  CreatePatientProfileSchema,
  UpdatePatientProfileSchema,
  GetPatientProfileSchema
} from "../validators/patient.validator";

export class PatientController {
  constructor(
    private readonly createProfileUC: ICreatePatientProfileUseCase,
    private readonly getProfileUC: IGetPatientProfileUseCase,
    private readonly updateProfileUC: IUpdatePatientProfileUseCase,
  ) {}

  createProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = CreatePatientProfileSchema.parse({
      userId: req.user.id,
      name: req.body.name,
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
      profileImage: req.body.profileImage,
      dateOfBirth: req.body.dateOfBirth,
      medicalHistory: req.body.medicalHistory,
      allergies: req.body.allergies,
      bloodGroup: req.body.bloodGroup,
      emergencyContactName: req.body.emergencyContactName,
      emergencyContactPhone: req.body.emergencyContactPhone,
    });

    const result = await this.createProfileUC.execute(dto);
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
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = GetPatientProfileSchema.parse({
      userId: req.user.id,
    });
    
    const result = await this.getProfileUC.execute(dto);
    const response = PatientMapper.toProfileResponse(result.user, result.patient);
    res.status(StatusCode.OK).json(response);
  });

  updateProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = UpdatePatientProfileSchema.parse({
      userId: req.user.id,
      updates: {
        ...req.body,
        dateOfBirth: req.body.dateOfBirth,
      },
    });

    const result = await this.updateProfileUC.execute(dto);
    const response = {
      message: result.message,
      patient: PatientMapper.toResponse(result.patient)
    };

    res.status(StatusCode.OK).json(response);
  });
}
