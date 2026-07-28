export interface AnalyticsReportSummary {
  totalRevenue: number;
  platformRevenue: number;
  doctorPayouts: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  confirmedAppointments: number;
  rescheduledAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  pendingDoctors: number;
}

export interface RevenueTrendItemDTO {
  label: string;
  revenue: number;
}

export interface AnalyticsReportDTO {
  generatedAt: string;
  period: {
    startDate?: string;
    endDate?: string;
    period?: string;
  };
  summary: AnalyticsReportSummary;
  statusBreakdown: Record<string, number>;
  revenueTrend: RevenueTrendItemDTO[];
}
