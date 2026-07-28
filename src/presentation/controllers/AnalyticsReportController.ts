import { Response, Request } from "express";
import { StatusCode } from "@common/enums";
import { catchAsync } from "@presentation/utils/catchAsync";
import { IGetAnalyticsReportUseCase } from "@application/interfaces/admin/IGetAnalyticsReportUseCase";
import { IPdfExporterService } from "@application/interfaces/services/IPdfExporterService";
import { IExcelExporterService } from "@application/interfaces/services/IExcelExporterService";

export class AnalyticsReportController {
  constructor(
    private readonly getAnalyticsReportUC: IGetAnalyticsReportUseCase,
    private readonly pdfExporterService: IPdfExporterService,
    private readonly excelExporterService: IExcelExporterService
  ) {}

  getAnalyticsReport = catchAsync(
    async (req: Request, res: Response) => {
      const { startDate, endDate, period } = req.query;

      const report = await this.getAnalyticsReportUC.execute({
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        period: period as string | undefined,
      });

      res.status(StatusCode.OK).json({
        success: true,
        data: report,
      });
    }
  );

  getAnalyticsReportPdf = catchAsync(
    async (req: Request, res: Response) => {
      const { startDate, endDate, period } = req.query;

      const report = await this.getAnalyticsReportUC.execute({
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        period: period as string | undefined,
      });

      const pdfBuffer = await this.pdfExporterService.generateAnalyticsPdf(report);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `MediConnect_Analytics_Report_${timestamp}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.status(StatusCode.OK).send(pdfBuffer);
    }
  );

  getAnalyticsReportExcel = catchAsync(
    async (req: Request, res: Response) => {
      const { startDate, endDate, period } = req.query;

      const report = await this.getAnalyticsReportUC.execute({
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        period: period as string | undefined,
      });

      const excelBuffer = await this.excelExporterService.generateAnalyticsExcel(report);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `MediConnect_Analytics_Report_${timestamp}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.status(StatusCode.OK).send(excelBuffer);
    }
  );
}
