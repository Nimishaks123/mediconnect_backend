// import { Router } from "express";
// import { PatientController } from "../controllers/PatientController";

// import {
//   createPatientProfileSchema,
//   updatePatientProfileSchema,
//   getPatientProfileSchema,
// } from "../validation/patientValidation";

// import { validateRequest } from "../middlewares/validateRequest";

// export function patientRoutes(patientController: PatientController) {
//   const router = Router();


//   router.post(
//     "/create",
//     validateRequest(createPatientProfileSchema),
//     patientController.createProfile
//   );

//   router.put(
//     "/update/:userId",
//     validateRequest(updatePatientProfileSchema),
//     patientController.updateProfile
//   );

//   router.get(
//     "/profile/:userId",
//     validateRequest(getPatientProfileSchema),
//     patientController.getProfile
//   );

//   return router;
// }
