import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";
import { AnalyticsReportFilterDTO } from "@application/dtos/admin/AnalyticsReportFilterDTO";
import { IDashboardQueryRepository } from "@application/interfaces/queries/IDashboardQueryRepository";
import { IGetAnalyticsReportUseCase } from "@application/interfaces/admin/IGetAnalyticsReportUseCase";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

export class GetAnalyticsReportUseCase implements IGetAnalyticsReportUseCase {
  constructor(
    private readonly dashboardQueryRepository: IDashboardQueryRepository
  ) {}

  async execute(filter?: AnalyticsReportFilterDTO): Promise<AnalyticsReportDTO> {
    if (filter?.period && !["weekly", "monthly", "yearly"].includes(filter.period)) {
      throw new AppError(
        "Invalid period parameter. Allowed values are 'weekly', 'monthly', or 'yearly'.",
        StatusCode.BAD_REQUEST
      );
    }

    if (filter?.startDate) {
      const startMs = Date.parse(filter.startDate);
      if (isNaN(startMs)) {
        throw new AppError(
          "Invalid startDate format. Please provide a valid date string.",
          StatusCode.BAD_REQUEST
        );
      }
    }

    if (filter?.endDate) {
      const endMs = Date.parse(filter.endDate);
      if (isNaN(endMs)) {
        throw new AppError(
          "Invalid endDate format. Please provide a valid date string.",
          StatusCode.BAD_REQUEST
        );
      }
    }

    if (filter?.startDate && filter?.endDate) {
      const startMs = Date.parse(filter.startDate);
      const endMs = Date.parse(filter.endDate);
      if (startMs > endMs) {
        throw new AppError(
          "Invalid date range: startDate cannot be after endDate.",
          StatusCode.BAD_REQUEST
        );
      }
    }

    return await this.dashboardQueryRepository.getAnalyticsReport(filter);
  }
}
