import { Router, RequestHandler } from 'express';
import { DoctorAppointmentController } from '@presentation/controllers/DoctorAppointmentController';
import { allowRoles } from '@presentation/middlewares/roleMiddleware';
import { UserRole } from "@application/constants/UserRole";
import { validateRequest } from '@presentation/middlewares/validateRequest';
import {
  GetDoctorAppointmentsSchema,
  CancelAppointmentByDoctorSchema,
  RescheduleAppointmentSchema
} from '@presentation/validators/doctorAppointment.validator';

export function doctorAppointmentRoutes(controller: DoctorAppointmentController, authMiddleware: RequestHandler) {
  const router = Router();

  router.use(authMiddleware, allowRoles(UserRole.DOCTOR));

  router.get(
    '/',
    validateRequest(GetDoctorAppointmentsSchema),
    controller.getAppointments
  );

  router.patch(
    '/:id/cancel',
    validateRequest(CancelAppointmentByDoctorSchema),
    controller.cancel
  );

  router.patch(
    '/:id/reschedule',
    validateRequest(RescheduleAppointmentSchema),
    controller.reschedule
  );

  return router;
}
