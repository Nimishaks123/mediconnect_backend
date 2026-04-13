import { Request } from "express";
import { AuthenticatedRequest } from "../../../types/AuthenticatedRequest";
import {
  StartDoctorOnboardingDTO,
  CreateDoctorProfileDTO,
  UpdateDoctorProfileDTO,
  UploadDoctorDocumentsDTO,
  SubmitForVerificationDTO,
  GetDoctorProfileDTO,
} from "@application/dtos/doctor";

import { Doctor } from "@domain/entities/Doctor";
import { DoctorSchedule } from "@domain/entities/DoctorSchedule";
import { Slot } from "@domain/entities/Slot";
import { DoctorResponseDTO } from "@application/dtos/doctor/DoctorResponseDTO";
import { DoctorScheduleOutputDTO } from "@application/dtos/doctorSchedule/DoctorScheduleOutputDTO";
import { DoctorSlotDTO } from "@application/dtos/doctorSchedule/DoctorSlotDTO";
import { DoctorSlotWithBookingDTO } from "@application/dtos/appointment/DoctorSlotWithBookingDTO";

export class DoctorMapper {
  static toSlotWithBookingResponse(slot: unknown): DoctorSlotWithBookingDTO {
    const s = slot as { _id: unknown; date: string; startTime: string; endTime: string; isBooked: boolean };
    return {
      _id: String(s._id),
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      isBooked: s.isBooked,
    };
  }

  static toSlotResponse(slot: Slot): DoctorSlotDTO {
    return {
      _id: slot.id,
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    };
  }

  static toScheduleResponse(schedule: DoctorSchedule): DoctorScheduleOutputDTO {
    return {
      id: schedule.id!,
      doctorId: schedule.doctorId,
      rrule: schedule.rrule,
      timeWindows: schedule.timeWindows,
      slotDuration: schedule.slotDuration,
      validFrom: schedule.validFrom.toISOString(),
      validTo: schedule.validTo.toISOString(),
      timezone: schedule.timezone,
    };
  }

  static toResponse(doctor: Doctor): DoctorResponseDTO {
    return {
      id: doctor.getId(),
      userId: doctor.getUserId(),
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      registrationNumber: doctor.registrationNumber,
      aboutMe: doctor.aboutMe,
      profilePhoto: doctor.profilePhoto ?? null,
      licenseDocument: doctor.licenseDocument ?? null,
      certifications: doctor.certifications ?? [],
      onboardingStatus: doctor.onboardingStatus,
      verificationStatus: doctor.verificationStatus,
      verifiedBy: doctor.verifiedBy ?? null,
      verifiedAt: doctor.verifiedAt ?? null,
      rejectionReason: doctor.rejectionReason ?? null,
    };
  }

  static toStartOnboardingDTO(req: AuthenticatedRequest): StartDoctorOnboardingDTO {
    return {
      userId: req.user.id,
    };
  }

  static toCreateDoctorProfileDTO(req: AuthenticatedRequest): CreateDoctorProfileDTO {
    const body = req.body as { 
      specialty: string; 
      qualification: string; 
      experience: string | number; 
      consultationFee: string | number; 
      registrationNumber: string; 
      aboutMe: string; 
    };
    return {
      userId: req.user.id,
      specialty: body.specialty,
      qualification: body.qualification,
      experience: Number(body.experience),
      consultationFee: Number(body.consultationFee),
      registrationNumber: body.registrationNumber,
      aboutMe: body.aboutMe,
    };
  }

  static toUpdateDoctorProfileDTO(req: AuthenticatedRequest): UpdateDoctorProfileDTO {
    const body = req.body;
    return {
      userId: req.user.id,
      updates: {
        specialty: body.specialty,
        qualification: body.qualification,
        experience: body.experience !== undefined ? Number(body.experience) : undefined,
        consultationFee: body.consultationFee !== undefined ? Number(body.consultationFee) : undefined,
        registrationNumber: body.registrationNumber,
        aboutMe: body.aboutMe,
        profilePhoto: body.profilePhoto, // Direct URL from Cloudinary
      },
    };
  }

  static toUploadDoctorDocumentsDTO(req: AuthenticatedRequest): UploadDoctorDocumentsDTO {
    const multerFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const files = {
      licenseDocument: multerFiles?.licenseDocument,
      certifications: multerFiles?.certifications,
    };

    return {
      userId: req.user.id,
      files,
      profilePhotoUrl: req.body.profilePhotoUrl,
    };
  }

  static toSubmitForVerificationDTO(req: AuthenticatedRequest): SubmitForVerificationDTO {
    return {
      userId: req.user.id,
    };
  }

  static toGetDoctorProfileDTO(req: AuthenticatedRequest): GetDoctorProfileDTO {
    return {
      userId: req.user.id,
    };
  }

  // Schedule related
  static toCreateDoctorScheduleDTO(req: AuthenticatedRequest): { 
    doctorId: string; 
    rrule: string; 
    timeWindows: { start: string; end: string }[]; 
    slotDuration: number; 
    validFrom: string; 
    validTo: string; 
    timezone: string 
  } {
    return {
      doctorId: req.user.id,
      rrule: req.body.rrule,
      timeWindows: req.body.timeWindows, 
      slotDuration: Number(req.body.slotDuration),
      validFrom: req.body.validFrom,
      validTo: req.body.validTo,
      timezone: req.body.timezone || 'UTC',
    };
  }

  static toGetSlotsWithBookingDTO(req: AuthenticatedRequest): { doctorUserId: string; from: string; to: string } {
    return {
      doctorUserId: req.user.id,
      from: String(req.query.from),
      to: String(req.query.to),
    };
  }

  // Slot related
  static toGenerateSlotsDTO(req: AuthenticatedRequest): { doctorId: string; from: Date; to: Date } {
    return {
      doctorId: req.user.id,
      from: new Date(req.query.from as string),
      to: new Date(req.query.to as string),
    };
  }

  static toGetSlotsForPatientDTO(req: Request): { doctorId: string; from: Date; to: Date } {
    return {
      doctorId: req.params.doctorId,
      from: new Date(req.query.from as string),
      to: new Date(req.query.to as string),
    };
  }
}
