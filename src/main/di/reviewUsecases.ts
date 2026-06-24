import {
  reviewRepository,
  reviewQueryRepository,
  appointmentRepository,
} from "./repositories";

import { CreateReviewUseCase } from "@application/usecases/review/CreateReviewUseCase";
import { GetDoctorReviewsUseCase } from "@application/usecases/review/GetDoctorReviewsUseCase";

export const createReviewUseCase =
  new CreateReviewUseCase(
    reviewRepository,
    appointmentRepository
  );

export const getDoctorReviewsUseCase =
  new GetDoctorReviewsUseCase(
    reviewQueryRepository
  );