import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAuth } from "../middlewares/requireAuth";
import { upload } from "../middlewares/multer";
import { validateRequest } from "../middlewares/validateRequest";
import { requireValidCloudinaryUrls } from "../middlewares/validateCloudinaryUrl";
import {
  startOnboardingSchema,
  updateDoctorProfileSchema,
  uploadDoctorDocumentsSchema,
  submitForVerificationSchema,
  getDoctorProfileSchema
} from "../validation/doctorValidation";

export function doctorRoutes(doctorController: DoctorController) {
  const router = Router();

  // =========================
  // START ONBOARDING
  // =========================
  router.post(
    "/onboarding/start",
    authMiddleware,
    requireAuth,
    validateRequest(startOnboardingSchema),
    doctorController.startOnboarding
  );

  // =========================
  // UPDATE BASIC PROFILE
  // =========================
  router.patch(
    "/profile",
    authMiddleware,
    requireAuth,
    validateRequest(updateDoctorProfileSchema),
    doctorController.updateProfile
  );

  // =========================
  // UPLOAD DOCUMENTS
  // =========================
  router.post(
    "/upload-documents",
    authMiddleware,
    requireAuth,
    upload.fields([
      { name: "licenseDocument", maxCount: 1 },
      { name: "certifications", maxCount: 10 },
    ]),
    requireValidCloudinaryUrls(["profilePhotoUrl"]),
    validateRequest(uploadDoctorDocumentsSchema),
    doctorController.uploadDocuments
  );

  // =========================
  // SUBMIT FOR VERIFICATION
  // =========================
  router.post(
    "/submit",
    authMiddleware,
    requireAuth,
    validateRequest(submitForVerificationSchema),
    doctorController.submitForVerification
  );

  // =========================
  // GET PROFILE
  // =========================
  router.get(
    "/profile",
    authMiddleware,
    requireAuth,
    validateRequest(getDoctorProfileSchema),
    doctorController.getProfile
  );

  router.get(
    "/verified",
    doctorController.getVerifiedDoctors // public 
  );
  
  return router;
}
