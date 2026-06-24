import { Router, RequestHandler } from "express";

import { ReviewController } from "../controllers/ReviewController";

import { requirePatient } from "../middlewares/roleMiddleware";

import { validateRequest } from "@presentation/middlewares/validateRequest";

import {
  createReviewSchema,getDoctorReviewsSchema
} from "@presentation/validators/review.validator";

export function reviewRoutes(
  controller: ReviewController,
  authMiddleware: RequestHandler
) {
  const router = Router();
router.post(
  "/",
  ...requirePatient(authMiddleware),
  validateRequest(createReviewSchema),
  controller.createReview
);

router.get(
  "/doctor/:doctorId",
  validateRequest(getDoctorReviewsSchema),
  controller.getDoctorReviews
);
  return router;
}