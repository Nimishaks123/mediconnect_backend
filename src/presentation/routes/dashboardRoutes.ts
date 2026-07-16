import { Router, RequestHandler } from "express";
import { AdminDashboardController } from "@presentation/controllers/AdminDashboardController";
import { requireAdmin } from "@presentation/middlewares/roleMiddleware";

export function dashboardRoutes(
  controller: AdminDashboardController,
  authMiddleware: RequestHandler
) {
  const router = Router();

  router.get(
    "/dashboard/overview",
    ...requireAdmin(authMiddleware),
    controller.getDashboardOverview
  );

  return router;
}