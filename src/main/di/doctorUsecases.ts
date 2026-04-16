// src/di/doctor.usecases.ts

import {
  StartDoctorOnboardingUseCase,
  CreateDoctorProfileUseCase,
  UpdateDoctorProfileUseCase,
  UploadDoctorDocumentsUseCase,
  SubmitForVerificationUseCase,
  GetDoctorProfileUseCase,
  GetVerifiedDoctorsUseCase,
} from "@application/usecases/doctor";

import {
  doctorRepository,
  userRepository,
} from "./repositories";

import {
  fileStorageService,
} from "./services";

export const startDoctorOnboardingUseCase =
  new StartDoctorOnboardingUseCase(
    doctorRepository,
    userRepository
  );

export const createDoctorProfileUseCase =
  new CreateDoctorProfileUseCase(doctorRepository);

export const updateDoctorProfileUseCase =
  new UpdateDoctorProfileUseCase(doctorRepository);

export const uploadDoctorDocumentsUseCase =
  new UploadDoctorDocumentsUseCase(
    doctorRepository,
    fileStorageService
  );

export const submitForVerificationUseCase =
  new SubmitForVerificationUseCase(doctorRepository);

export const getDoctorProfileUseCase =
  new GetDoctorProfileUseCase(
    userRepository,
    doctorRepository
  );

export const getVerifiedDoctorsUseCase =
  new GetVerifiedDoctorsUseCase(
    doctorRepository,
    userRepository
  );
