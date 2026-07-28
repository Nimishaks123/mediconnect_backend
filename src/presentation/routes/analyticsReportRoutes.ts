import { Router, RequestHandler } from "express";
import { AnalyticsReportController } from "@presentation/controllers/AnalyticsReportController";
import { requireAdmin } from "@presentation/middlewares/roleMiddleware";

export function analyticsReportRoutes(
  controller: AnalyticsReportController,
  authMiddleware: RequestHandler
) {
  const router = Router();

  router.get(
    "/reports/analytics",
    ...requireAdmin(authMiddleware),
    controller.getAnalyticsReport
  );

  router.get(
    "/reports/analytics/pdf",
    ...requireAdmin(authMiddleware),
    controller.getAnalyticsReportPdf
  );

  router.get(
    "/reports/analytics/excel",
    ...requireAdmin(authMiddleware),
    controller.getAnalyticsReportExcel
  );

  return router;
}
