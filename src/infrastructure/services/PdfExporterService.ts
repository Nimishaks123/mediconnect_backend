import PDFDocument from "pdfkit";
import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";
import { IPdfExporterService } from "@application/interfaces/services/IPdfExporterService";

export class PdfExporterService implements IPdfExporterService {
  async generateAnalyticsPdf(report: AnalyticsReportDTO): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: "A4" });
        const buffers: Buffer[] = [];

        doc.on("data", (chunk: Buffer) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err: Error) => reject(err));

        const primaryColor = "#0F4C81";
        const accentColor = "#0ea5e9";
        const textColor = "#1f2937";
        const lightBg = "#f8fafc";
        const borderColor = "#e2e8f0";

        doc.fillColor(primaryColor).fontSize(20).font("Helvetica-Bold").text("MediConnect Healthcare", 40, 40);
        doc.fontSize(14).font("Helvetica").text("Executive Analytics & Financial Performance Report", 40, 65);
        doc.fillColor(accentColor).fontSize(10).text(`Generated: ${new Date(report.generatedAt).toLocaleString()}`, 40, 85);

        doc.moveTo(40, 102).lineTo(555, 102).strokeColor(borderColor).lineWidth(1).stroke();

        let y = 115;
        doc.rect(40, y, 515, 40).fillAndStroke(lightBg, borderColor);
        doc.fillColor(textColor).fontSize(9).font("Helvetica-Bold").text("REPORT METADATA", 50, y + 8);

        const periodVal = (report.period.period || "monthly").toUpperCase();
        const periodLabel = `Filter Period: ${periodVal}`;
        const dateRangeLabel = report.period.startDate && report.period.endDate
          ? `Date Range: ${report.period.startDate} to ${report.period.endDate}`
          : "Date Range: Full Historical Overview";

        doc.font("Helvetica").text(`${periodLabel}   |   ${dateRangeLabel}`, 50, y + 22);

        y = 170;
        doc.fillColor(primaryColor).fontSize(12).font("Helvetica-Bold").text("1. Executive Financial & Operational Summary", 40, y);
        y += 20;

        const metrics = [
          { label: "Total Revenue", value: `INR ${report.summary.totalRevenue.toLocaleString()}` },
          { label: "Platform Revenue", value: `INR ${report.summary.platformRevenue.toLocaleString()}` },
          { label: "Doctor Payouts", value: `INR ${report.summary.doctorPayouts.toLocaleString()}` },
          { label: "Total Appointments", value: String(report.summary.totalAppointments) },
          { label: "Completed Appointments", value: String(report.summary.completedAppointments) },
          { label: "Cancelled Appointments", value: String(report.summary.cancelledAppointments) },
          { label: "Confirmed Appointments", value: String(report.summary.confirmedAppointments) },
          { label: "Rescheduled Appointments", value: String(report.summary.rescheduledAppointments) },
          { label: "Total Registered Patients", value: String(report.summary.totalPatients) },
          { label: "Total Registered Doctors", value: String(report.summary.totalDoctors) },
          { label: "Pending Doctor Verifications", value: String(report.summary.pendingDoctors) },
        ];

        const colWidth = 250;
        const rowHeight = 20;

        metrics.forEach((item, index) => {
          const rowY = y + (index * rowHeight);
          if (index % 2 === 0) {
            doc.rect(40, rowY, 515, rowHeight).fill(lightBg);
          }
          doc.fillColor(textColor).fontSize(9).font("Helvetica").text(item.label, 50, rowY + 5);
          doc.font("Helvetica-Bold").text(item.value, 300, rowY + 5, { width: colWidth, align: "right" });
        });

        y += (metrics.length * rowHeight) + 25;

        doc.fillColor(primaryColor).fontSize(12).font("Helvetica-Bold").text("2. Appointment Status Summary", 40, y);
        y += 20;

        doc.rect(40, y, 515, 20).fill("#e2e8f0");
        doc.fillColor(primaryColor).fontSize(9).font("Helvetica-Bold");
        doc.text("Status Category", 50, y + 5);
        doc.text("Total Appointments Count", 350, y + 5, { width: 195, align: "right" });
        y += 20;

        const statusEntries = Object.entries(report.statusBreakdown);
        if (statusEntries.length === 0) {
          doc.fillColor(textColor).fontSize(9).font("Helvetica").text("No appointment status data recorded.", 50, y + 5);
          y += 20;
        } else {
          statusEntries.forEach(([status, count], idx) => {
            if (idx % 2 === 0) {
              doc.rect(40, y, 515, 20).fill(lightBg);
            }
            const statusFormatted = status.charAt(0).toUpperCase() + status.slice(1);
            doc.fillColor(textColor).fontSize(9).font("Helvetica").text(statusFormatted, 50, y + 5);
            doc.font("Helvetica-Bold").text(String(count), 350, y + 5, { width: 195, align: "right" });
            y += 20;
          });
        }

        y += 25;

        if (y > 650) {
          doc.addPage();
          y = 40;
        }

        doc.fillColor(primaryColor).fontSize(12).font("Helvetica-Bold").text("3. Revenue Trend Overview", 40, y);
        y += 20;

        doc.rect(40, y, 515, 20).fill("#e2e8f0");
        doc.fillColor(primaryColor).fontSize(9).font("Helvetica-Bold");
        doc.text("Time Period (Label)", 50, y + 5);
        doc.text("Total Consultation Revenue", 350, y + 5, { width: 195, align: "right" });
        y += 20;

        if (report.revenueTrend.length === 0) {
          doc.fillColor(textColor).fontSize(9).font("Helvetica").text("No revenue data available for the selected period.", 50, y + 5);
          y += 20;
        } else {
          report.revenueTrend.forEach((item, idx) => {
            if (y > 750) {
              doc.addPage();
              y = 40;

              doc.fillColor(primaryColor).fontSize(12).font("Helvetica-Bold").text("3. Revenue Trend Overview (Contd.)", 40, y);
              y += 20;

              doc.rect(40, y, 515, 20).fill("#e2e8f0");
              doc.fillColor(primaryColor).fontSize(9).font("Helvetica-Bold");
              doc.text("Time Period (Label)", 50, y + 5);
              doc.text("Total Consultation Revenue", 350, y + 5, { width: 195, align: "right" });
              y += 20;
            }
            if (idx % 2 === 0) {
              doc.rect(40, y, 515, 20).fill(lightBg);
            }
            doc.fillColor(textColor).fontSize(9).font("Helvetica").text(item.label, 50, y + 5);
            doc.font("Helvetica-Bold").text(`INR ${item.revenue.toLocaleString()}`, 350, y + 5, { width: 195, align: "right" });
            y += 20;
          });
        }

        doc.fillColor("#94a3b8").fontSize(8).font("Helvetica")
          .text("MediConnect Admin Panel — Confidential & Proprietary Report", 40, 780, { align: "center" });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
