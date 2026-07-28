import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";

export interface IExcelExporterService {
  generateAnalyticsExcel(report: AnalyticsReportDTO): Promise<Buffer>;
}
