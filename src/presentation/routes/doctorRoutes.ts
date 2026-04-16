import { Router, RequestHandler } from "express";
import { DoctorController } from "../controllers/DoctorController";
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

export function doctorRoutes(doctorController: DoctorController, authMiddleware: RequestHandler) {
  const router = Router();

  router.get(
    "/verified",
    doctorController.getVerifiedDoctors
  );

  router.use(authMiddleware);

  // =========================
  // START ONBOARDING
  // =========================
  router.post(
    "/onboarding/start",
    validateRequest(startOnboardingSchema),
    doctorController.startOnboarding
  );

  // =========================
  // UPDATE BASIC PROFILE
  // =========================
  router.patch(
    "/profile",
    validateRequest(updateDoctorProfileSchema),
    doctorController.updateProfile
  );

  // =========================
  // UPLOAD DOCUMENTS
  // =========================
  router.post(
    "/upload-documents",
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
    validateRequest(submitForVerificationSchema),
    doctorController.submitForVerification
  );

  // =========================
  // GET PROFILE
  // =========================
  router.get(
    "/profile",
    validateRequest(getDoctorProfileSchema),
    doctorController.getProfile
  );
  
  return router;
}
