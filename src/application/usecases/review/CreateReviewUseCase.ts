import {Types} from "mongoose"
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { Review } from "@domain/entities/Review";

import { IReviewRepository } from "@domain/interfaces/IReviewRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";

import { CreateReviewDTO } from "@application/dtos/review/CreateReviewDTO";
import { ICreateReviewUseCase } from "@application/interfaces/review/ICreateReviewUseCase";

export class CreateReviewUseCase implements ICreateReviewUseCase {
  constructor(
    private readonly reviewRepo: IReviewRepository,
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(
    dto: CreateReviewDTO
  ): Promise<void> {
    const {
      appointmentId,
      patientId,
      rating,
      comment,
    } = dto;

    const appointment =
      await this.appointmentRepo.findById(
        appointmentId
      );

    if (!appointment) {
      throw new AppError(
        "Appointment not found",
        StatusCode.NOT_FOUND
      );
    }

    if (
      appointment.getPatientId() !==
      patientId
    ) {
      throw new AppError(
        "Unauthorized",
        StatusCode.FORBIDDEN
      );
    }

    if (
      appointment.getStatus() !==
      AppointmentStatus.COMPLETED
    ) {
      throw new AppError(
        "Review can only be submitted after appointment completion",
        StatusCode.BAD_REQUEST
      );
    }

    const existing =
      await this.reviewRepo.findByAppointmentId(
        appointmentId
      );

    if (existing) {
      throw new AppError(
        "Review already submitted",
        StatusCode.CONFLICT
      );
    }
    const reviewId=new Types.ObjectId().toString();

    const review = new Review(
      reviewId,
      appointmentId,
      appointment.getDoctorId(),
      patientId,
      rating,
      comment,
      new Date()
    );

    await this.reviewRepo.save(review);
  }
}