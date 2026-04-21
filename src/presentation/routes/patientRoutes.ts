import { Router, RequestHandler } from "express";
import { PatientController } from "../controllers/PatientController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { requireValidCloudinaryUrls } from "../middlewares/validateCloudinaryUrl";
import { requirePatient } from "../middlewares/roleMiddleware";
import {
  createPatientProfileSchema,
  updatePatientProfileSchema,
  getPatientProfileSchema,
} from "../validation/patientValidation";

export function patientRoutes(patientController: PatientController, authMiddleware: RequestHandler) {
  const router = Router();

  const patientAuth = requirePatient(authMiddleware);

  /**
   * @route   GET /api/patient/profile
   * @desc    Get current patient profile
   * @access  Private (Patient)
   */
  router.get(
    "/profile",
    ...patientAuth,
    validateRequest(getPatientProfileSchema),
    patientController.getProfile
  );

  /**
   * @route   POST /api/patient/profile
   * @desc    Create patient profile
   * @access  Private (Patient)
   */
  router.post(
    "/profile",
    ...patientAuth,
    requireValidCloudinaryUrls(["profileImage"]),
    validateRequest(createPatientProfileSchema),
    patientController.createProfile
  );

  /**
   * @route   PUT /api/patient/profile
   * @desc    Update patient profile
   * @access  Private (Patient)
   */
  router.put(
    "/profile",
    ...patientAuth,
    requireValidCloudinaryUrls(["profileImage"]),
    validateRequest(updatePatientProfileSchema),
    patientController.updateProfile
  );

  return router;
}

