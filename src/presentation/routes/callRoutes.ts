import { Router, RequestHandler } from "express";
import { CallController } from "../controllers/CallController";
import { validateRequest } from "../middlewares/validateRequest";
import { eligibilityParamsSchema } from "../validators/call.validator";

export const callRoutes = (callController: CallController, authMiddleware: RequestHandler) => {
  const router = Router();

  router.use(authMiddleware);

  router.get(
    "/eligible/:appointmentId",
    validateRequest(eligibilityParamsSchema),
    callController.checkEligibility
  );

  return router;
};
