import { Router } from "express";
import { PatientController } from "../controllers/PatientController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAuth } from "../middlewares/requireAuth";
import { validateRequest } from "../middlewares/validateRequest";
import { requireValidCloudinaryUrls } from "../middlewares/validateCloudinaryUrl";
import {
  createPatientProfileSchema,
  updatePatientProfileSchema,
  getPatientProfileSchema,
} from "../validation/patientValidation";

export function patientRoutes(patientController: PatientController) {
  const router = Router();

  /**
   * @route   GET /api/patient/profile
   * @desc    Get current patient profile
   * @access  Private (Patient)
   */
  router.get(
    "/profile",
    authMiddleware,
    requireAuth,
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
    authMiddleware,
    requireAuth,
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
    authMiddleware,
    requireAuth,
    requireValidCloudinaryUrls(["profileImage"]),
    validateRequest(updatePatientProfileSchema),
    patientController.updateProfile
  );

  return router;
}
