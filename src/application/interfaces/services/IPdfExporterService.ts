import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";

export interface IPdfExporterService {
  generateAnalyticsPdf(report: AnalyticsReportDTO): Promise<Buffer>;
}
