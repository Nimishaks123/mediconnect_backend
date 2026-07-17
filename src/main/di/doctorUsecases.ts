import {
  StartDoctorOnboardingUseCase,
  CreateDoctorProfileUseCase,
  UpdateDoctorProfileUseCase,
  UploadDoctorDocumentsUseCase,
  SubmitForVerificationUseCase,
  GetDoctorProfileUseCase,
  GetVerifiedDoctorsUseCase,
  GetDoctorByIdUseCase,
} from "@application/usecases/doctor";
import { GetRecentActivityUseCase } from "@application/usecases/doctor/GetRecentActivityUseCase";

import {
  doctorRepository,
  userRepository,
  doctorDashboardQueryRepository,
} from "./repositories";

import {
  fileStorageService,
} from "./services";
import { GetDoctorSpecialtiesUseCase } from "@application/usecases/doctor/GetDoctorSpecialtiesUseCase";

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
export const getDoctorByIdUseCase =
  new GetDoctorByIdUseCase(
    doctorRepository,
      userRepository
  );
  export const getDoctorBySpecialtyUC=new GetDoctorSpecialtiesUseCase(doctorRepository);export const getRecentActivityUseCase = new GetRecentActivityUseCase(doctorDashboardQueryRepository);
