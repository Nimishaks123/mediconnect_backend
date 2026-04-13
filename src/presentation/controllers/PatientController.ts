import { Response } from "express";
import { StatusCode } from "@common/enums";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { catchAsync } from "../utils/catchAsync";
import { PatientMapper } from "../mappers/patient/PatientMapper";
import { CreatePatientProfileUseCase } from "@application/usecases/patient/CreatePatientProfileUseCase";
import { GetPatientProfileUseCase } from "@application/usecases/patient/GetPatientProfileUseCase";
import { UpdatePatientProfileUseCase } from "@application/usecases/patient/UpdatePatientProfileUseCase";

export class PatientController {
  constructor(
    private readonly createProfileUC: CreatePatientProfileUseCase,
    private readonly getProfileUC: GetPatientProfileUseCase,
    private readonly updateProfileUC: UpdatePatientProfileUseCase,
  ) {}

  createProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const dto = PatientMapper.toCreatePatientProfileDTO(req);

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
    const dto = { userId: req.user.id };
    const result = await this.getProfileUC.execute(dto);
    const response = PatientMapper.toProfileResponse(result.user, result.patient);
    res.status(StatusCode.OK).json(response);
  });

  updateProfile = catchAsync(async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const dto = PatientMapper.toUpdatePatientProfileDTO(req);

    const result = await this.updateProfileUC.execute(dto);
    const response = {
      message: result.message,
      patient: PatientMapper.toResponse(result.patient)
    };

    res.status(StatusCode.OK).json(response);
  });
}
