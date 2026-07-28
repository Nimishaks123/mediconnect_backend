import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";
import { AnalyticsReportFilterDTO } from "@application/dtos/admin/AnalyticsReportFilterDTO";

export interface IGetAnalyticsReportUseCase {
  execute(filter?: AnalyticsReportFilterDTO): Promise<AnalyticsReportDTO>;
}
