import { Router } from 'express';
import { DoctorAppointmentController } from '@presentation/controllers/DoctorAppointmentController';
import { authMiddleware } from '@presentation/middlewares/authMiddleware';
import { allowRoles } from '@presentation/middlewares/roleMiddleware';
import { UserRole } from "@application/constants/UserRole";
import { z } from 'zod';
import { validateRequest } from '@presentation/middlewares/validateRequest';

export function doctorAppointmentRoutes(controller: DoctorAppointmentController) {
  const router = Router();

  router.get(
    '/',
    authMiddleware,
    allowRoles(UserRole.DOCTOR),
    controller.getAppointments
  );

  const cancelSchema = z.object({
    body: z.object({
      reason: z.enum(['EXPIRED', 'FAILED', 'CANCELLED']).optional(),
    }),
  });

  router.patch(
    '/:id/cancel',
    authMiddleware,
    allowRoles(UserRole.DOCTOR),
    validateRequest(cancelSchema),
    controller.cancel
  );

  const rescheduleSchema = z.object({
    body: z.object({
      newSlotId: z.string(), //availability id 
    }),
  });

  router.patch(
    '/:id/reschedule',
    authMiddleware,
    allowRoles(UserRole.DOCTOR),
    validateRequest(rescheduleSchema),
    controller.reschedule
  );

  return router;
}
