// src/di/schedule.usecases.ts

import {
  CreateDoctorScheduleUseCase,
  GenerateDoctorSlotsUseCase,
} from "@application/usecases/schedule";
import { DeleteDoctorSlotUseCase } from "@application/usecases/schedule/DeleteDoctorSlotUseCase";
import { doctorRepository } from "./repositories";

import { doctorScheduleRepository } from "./repositories";
import { rrulePolicy } from "./services";
import { GetDoctorSlotsWithBookingUseCase } from "@application/usecases/schedule/GetDoctorSlotsWithBookingUseCase";
import { appointmentRepository } from "./repositories";
import { SlotAvailabilityService } from "@domain/services/SlotAvailabilityService";

const availabilityService = new SlotAvailabilityService();

export const createDoctorScheduleUseCase = new CreateDoctorScheduleUseCase(
  doctorScheduleRepository,
  doctorRepository,
  rrulePolicy
);

export const generateDoctorSlotsUseCase =
  new GenerateDoctorSlotsUseCase(
    doctorScheduleRepository,
    doctorRepository,
    appointmentRepository,
    rrulePolicy,
    availabilityService
  );

export const getDoctorSlotsWithBookingUseCase =
  new GetDoctorSlotsWithBookingUseCase(
    doctorScheduleRepository,
    appointmentRepository,
    doctorRepository,
    availabilityService,
    rrulePolicy
  );

export const deleteDoctorSlotUseCase = new DeleteDoctorSlotUseCase(
  doctorScheduleRepository,
  doctorRepository
);