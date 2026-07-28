import ExcelJS from "exceljs";
import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";
import { IExcelExporterService } from "@application/interfaces/services/IExcelExporterService";

export class ExcelExporterService implements IExcelExporterService {
  async generateAnalyticsExcel(report: AnalyticsReportDTO): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "MediConnect Healthcare Platform";
    workbook.created = new Date();

    const headerFill: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F4C81" },
    };

    const headerFont: Partial<ExcelJS.Font> = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
    };

    const titleFont: Partial<ExcelJS.Font> = {
      bold: true,
      size: 14,
      color: { argb: "FF0F4C81" },
    };

    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.addRow(["MediConnect Executive Analytics Summary"]).font = titleFont;
    summarySheet.addRow([`Report Generated: ${new Date(report.generatedAt).toLocaleString()}`]);
    summarySheet.addRow([
      `Filter Period: ${(report.period.period || "monthly").toUpperCase()}`,
      report.period.startDate && report.period.endDate
        ? `Date Range: ${report.period.startDate} to ${report.period.endDate}`
        : "Date Range: Full Overview",
    ]);
    summarySheet.addRow([]);

    const summaryHeaderRow = summarySheet.addRow(["KPI Metric", "Value"]);
    summaryHeaderRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    const metricsData = [
      ["Total Consultation Revenue", report.summary.totalRevenue, "currency"],
      ["Platform Fee Revenue", report.summary.platformRevenue, "currency"],
      ["Doctor Payouts (Net)", report.summary.doctorPayouts, "currency"],
      ["Total Appointments", report.summary.totalAppointments, "number"],
      ["Completed Appointments", report.summary.completedAppointments, "number"],
      ["Cancelled Appointments", report.summary.cancelledAppointments, "number"],
      ["Confirmed Appointments", report.summary.confirmedAppointments, "number"],
      ["Rescheduled Appointments", report.summary.rescheduledAppointments, "number"],
      ["Registered Patients", report.summary.totalPatients, "number"],
      ["Registered Doctors", report.summary.totalDoctors, "number"],
      ["Pending Doctor Verifications", report.summary.pendingDoctors, "number"],
    ] as const;

    metricsData.forEach(([label, value, type]) => {
      const row = summarySheet.addRow([label, value]);
      const valueCell = row.getCell(2);
      if (type === "currency") {
        valueCell.numFmt = "₹#,##0";
      } else {
        valueCell.numFmt = "#,##0";
      }
    });

    const trendSheet = workbook.addWorksheet("Revenue Trend");
    trendSheet.addRow(["Revenue Trend Overview"]).font = titleFont;
    trendSheet.addRow([`Generated: ${new Date(report.generatedAt).toLocaleString()}`]);
    trendSheet.addRow([]);

    const trendHeaderRow = trendSheet.addRow(["Time Period (Label)", "Revenue (INR)"]);
    trendHeaderRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    report.revenueTrend.forEach((item) => {
      const row = trendSheet.addRow([item.label, item.revenue]);
      row.getCell(2).numFmt = "₹#,##0";
    });

    const statusSheet = workbook.addWorksheet("Appointment Status");
    statusSheet.addRow(["Appointment Status Breakdown"]).font = titleFont;
    statusSheet.addRow([`Generated: ${new Date(report.generatedAt).toLocaleString()}`]);
    statusSheet.addRow([]);

    const statusHeaderRow = statusSheet.addRow(["Status Category", "Total Count"]);
    statusHeaderRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    Object.entries(report.statusBreakdown).forEach(([status, count]) => {
      const statusFormatted = status.charAt(0).toUpperCase() + status.slice(1);
      const row = statusSheet.addRow([statusFormatted, count]);
      row.getCell(2).numFmt = "#,##0";
    });

    [summarySheet, trendSheet, statusSheet].forEach((sheet) => {
      sheet.columns.forEach((column) => {
        let maxLen = 15;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const valStr = cell.value ? String(cell.value) : "";
          if (valStr.length > maxLen) {
            maxLen = valStr.length;
          }
        });
        column.width = Math.min(maxLen + 4, 45);
      });
    });

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}
