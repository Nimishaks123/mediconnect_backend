import {
  CreatePatientProfileUseCase,
  UpdatePatientProfileUseCase,
  GetPatientProfileUseCase,
} from "@application/usecases/patient";

import { patientRepository, userRepository } from "./repositories";

export const createPatientProfileUseCase = new CreatePatientProfileUseCase(patientRepository);
export const updatePatientProfileUseCase = new UpdatePatientProfileUseCase(patientRepository);
export const getPatientProfileUseCase = new GetPatientProfileUseCase(userRepository, patientRepository);
