import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAuth } from "../middlewares/requireAuth";
import { upload } from "../middlewares/multer";

export function doctorRoutes(doctorController: DoctorController) {
  const router = Router();

  // =========================
  // START ONBOARDING
  // =========================
  router.post(
    "/onboarding/start",
    authMiddleware,
    requireAuth,
    doctorController.startOnboarding
  );

  // =========================
  // UPDATE BASIC PROFILE
  // =========================
  router.patch(
    "/profile",
    authMiddleware,
    requireAuth,
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
      { name: "profilePhoto", maxCount: 1 },
      { name: "certifications", maxCount: 10 },
    ]),
    doctorController.uploadDocuments
  );

  // =========================
  // SUBMIT FOR VERIFICATION
  // =========================
  router.post(
    "/submit",
    authMiddleware,
    requireAuth,
    doctorController.submitForVerification
  );

  // =========================
  // GET PROFILE
  // =========================
  router.get(
    "/profile",
    authMiddleware,
    requireAuth,
    doctorController.getProfile
  );

  router.get(
    "/verified",
    doctorController.getVerifiedDoctors // public → no auth
  );

  return router;
}
