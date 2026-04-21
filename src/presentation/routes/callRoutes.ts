import { Router, RequestHandler } from "express";
import { CallController } from "../controllers/CallController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { eligibilityParamsSchema } from "../validators/call.validator";

export const callRoutes = (callController: CallController, authMiddleware: RequestHandler) => {
  const router = Router();

  router.get(
    "/eligible/:appointmentId",
    authMiddleware,
    validateRequest(eligibilityParamsSchema),
    callController.checkEligibility
  );

  return router;
};

