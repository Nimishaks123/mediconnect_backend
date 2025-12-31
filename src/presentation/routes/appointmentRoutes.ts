import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";

export function appointmentRoutes(
  controller: AppointmentController
) {
  const router = Router();

  /* =========================
     PUBLIC
     ========================= */
  router.get(
    "/doctors/:doctorId/availability",
    controller.getDoctorAvailability
  );

  /* =========================
     PATIENT
     ========================= */
  router.post(
    "/appointments",
    authMiddleware,
    allowRoles("PATIENT"),
    controller.bookAppointment
  );

  /* =========================
     DOCTOR
     ========================= */
  router.post(
    "/availability",
    authMiddleware,
    allowRoles("DOCTOR"),
    controller.createAvailability
  );

  router.patch(
    "/appointments/:id/confirm",
    authMiddleware,
    allowRoles("DOCTOR"),
    controller.confirmAppointment
  );

  router.patch(
    "/appointments/:id/complete",
    authMiddleware,
    allowRoles("DOCTOR"),
    controller.completeAppointment
  );

  /* =========================
     DOCTOR OR PATIENT
     ========================= */
  router.patch(
    "/appointments/:id/cancel",
    authMiddleware,
    allowRoles("DOCTOR", "PATIENT"),
    controller.cancelAppointment
  );

  return router;
}
