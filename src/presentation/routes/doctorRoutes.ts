// import { Router } from "express";
// import { DoctorController } from "../controllers/DoctorController";
// import { authMiddleware } from "../middlewares/authMiddleware";
// import { upload } from "../middlewares/multer";

// export function doctorRoutes(doctorController: DoctorController) {
//   const router = Router();

//   // =========================
//   // START ONBOARDING
//   // =========================
//   router.post(
//     "/onboarding/start",
//     authMiddleware,
//     doctorController.startOnboarding
//   );

//   // =========================
//   // UPDATE BASIC PROFILE
//   // =========================
//   router.patch(
//     "/profile",
//     authMiddleware,
//     doctorController.updateProfile
//   );

//   // =========================
//   // UPLOAD DOCUMENTS
//   // =========================
//   router.post(
//   "/upload-documents",
//   authMiddleware,
//   upload.fields([
//     { name: "licenseDocument", maxCount: 1 },
//     { name: "profilePhoto", maxCount: 1 },
//     { name: "certifications", maxCount: 10 },
//   ]),
//   doctorController.uploadDocuments
// );

//   // =========================
//   // SUBMIT FOR VERIFICATION
//   // =========================
//   router.post(
//     "/submit",
//     authMiddleware,
//     doctorController.submitForVerification
//   );

//   // =========================
//   // GET PROFILE
//   // =========================
//   router.get(
//     "/profile",
//     authMiddleware,
//     doctorController.getProfile
//   );

//   return router;
// }
import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { upload } from "../middlewares/multer";

export function doctorRoutes(doctorController: DoctorController) {
  const router = Router();

  // =========================
  // START ONBOARDING
  // =========================
  router.post(
    "/onboarding/start",
    doctorController.startOnboarding
  );

  // =========================
  // UPDATE BASIC PROFILE
  // =========================
  router.patch(
    "/profile",
    doctorController.updateProfile
  );

  // =========================
  // UPLOAD DOCUMENTS
  // =========================
  router.post(
    "/upload-documents",
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
    doctorController.submitForVerification
  );

  // =========================
  // GET PROFILE
  // =========================
  router.get(
    "/profile",
    doctorController.getProfile
  );
    router.get(
    "/verified",
   doctorController.getVerifiedDoctors
  );

  return router;
}
