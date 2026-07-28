import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";
import { RevenueTrendDTO } from "@application/dtos/admin/RevenueTrendDTO";
import { AppointmentStatusAnalyticsDTO } from "@application/dtos/admin/AppointmentStatusAnalyticsDTO";
import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";
import { AnalyticsReportFilterDTO } from "@application/dtos/admin/AnalyticsReportFilterDTO";
import { IDashboardQueryRepository } from "@application/interfaces/queries/IDashboardQueryRepository";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { PaymentStatus } from "@domain/enums/PaymentStatus";
import { DoctorVerificationStatus } from "@domain/enums/DoctorVerificationStatus";
import { AppointmentModel } from "../persistence/models/AppointmentModel";
import { DoctorModel } from "../persistence/models/DoctorModel";
import { PlatformWalletModel } from "../persistence/models/PlatformWalletModel";
import { UserModel } from "../persistence/models/UserModel";

export class DashboardQueryRepository
  implements IDashboardQueryRepository
{
  async getDashboardOverview(): Promise<DashboardOverviewDTO> {
    const today = new Date().toISOString().split("T")[0];

    const [
      revenueResult,
      platformWallet,
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      todayAppointments,
    ] = await Promise.all([
      AppointmentModel.aggregate([
        {
          $match: {
            paymentStatus: PaymentStatus.SUCCESS,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$price",
            },
          },
        },
      ]),

      PlatformWalletModel.findOne(),

      UserModel.countDocuments(),

      DoctorModel.countDocuments(),

      DoctorModel.countDocuments({
        verificationStatus: DoctorVerificationStatus.PENDING,
      }),

      AppointmentModel.countDocuments(),

      AppointmentModel.countDocuments({
        date: today,
        status: {
          $in: [
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.COMPLETED,
          ],
        },
      }),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue ?? 0;
    const platformRevenue = platformWallet?.balance ?? 0;
    const doctorPayouts = Math.max(0, totalRevenue - platformRevenue);

    return {
      totalRevenue,
      platformRevenue,
      doctorPayouts,
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalAppointments,
      todayAppointments,
    };
  }

  async getRevenueTrend(period: string = "monthly"): Promise<RevenueTrendDTO> {
    if (period === "weekly") {
      const results = await AppointmentModel.aggregate([
        {
          $match: {
            paymentStatus: PaymentStatus.SUCCESS,
          },
        },
        {
          $group: {
            _id: {
              year: { $isoWeekYear: "$createdAt" },
              week: { $isoWeek: "$createdAt" },
            },
            revenue: { $sum: "$price" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.week": 1,
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: "$_id.year" },
                "-W",
                {
                  $cond: [
                    { $lt: ["$_id.week", 10] },
                    { $concat: ["0", { $toString: "$_id.week" }] },
                    { $toString: "$_id.week" },
                  ],
                },
              ],
            },
            revenue: 1,
          },
        },
      ]);
      return results;
    }

    if (period === "yearly") {
      const results = await AppointmentModel.aggregate([
        {
          $match: {
            paymentStatus: PaymentStatus.SUCCESS,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
            },
            revenue: { $sum: "$price" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
          },
        },
        {
          $project: {
            _id: 0,
            month: { $toString: "$_id.year" },
            revenue: 1,
          },
        },
      ]);
      return results;
    }

    const results = await AppointmentModel.aggregate([
      {
        $match: {
          paymentStatus: PaymentStatus.SUCCESS,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$price" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
              },
            },
          },
          revenue: 1,
        },
      },
    ]);

    return results;
  }

  async getAppointmentStatusAnalytics(): Promise<AppointmentStatusAnalyticsDTO> {
    const results = await AppointmentModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);
    return results;
  }

  async getAnalyticsReport(filter?: AnalyticsReportFilterDTO): Promise<AnalyticsReportDTO> {
    const [overview, statusRawList, trendRawList] = await Promise.all([
      this.getDashboardOverview(),
      this.getAppointmentStatusAnalytics(),
      this.getRevenueTrend(filter?.period),
    ]);

    const formatStatusKey = (status: string): string => {
      switch (status) {
        case AppointmentStatus.COMPLETED: return "completed";
        case AppointmentStatus.CANCELLED: return "cancelled";
        case AppointmentStatus.CONFIRMED: return "confirmed";
        case AppointmentStatus.RESCHEDULED: return "rescheduled";
        case AppointmentStatus.IN_PROGRESS: return "inProgress";
        case AppointmentStatus.NO_SESSION: return "noSession";
        case AppointmentStatus.PAYMENT_PENDING: return "paymentPending";
        default: return status.toLowerCase();
      }
    };

    const statusBreakdown: Record<string, number> = {};
    statusRawList.forEach((item) => {
      if (item.status) {
        statusBreakdown[formatStatusKey(item.status)] = item.count;
      }
    });

    const revenueTrend = trendRawList.map((item) => ({
      label: item.month,
      revenue: item.revenue,
    }));

    const summary = {
      totalRevenue: overview.totalRevenue,
      platformRevenue: overview.platformRevenue,
      doctorPayouts: overview.doctorPayouts,
      totalAppointments: overview.totalAppointments,
      completedAppointments: statusBreakdown.completed ?? 0,
      cancelledAppointments: statusBreakdown.cancelled ?? 0,
      confirmedAppointments: statusBreakdown.confirmed ?? 0,
      rescheduledAppointments: statusBreakdown.rescheduled ?? 0,
      totalPatients: overview.totalPatients,
      totalDoctors: overview.totalDoctors,
      pendingDoctors: overview.pendingDoctors,
    };

    const periodMeta: { startDate?: string; endDate?: string; period: string } = {
      period: filter?.period || "monthly",
    };
    if (filter?.startDate) {
      periodMeta.startDate = filter.startDate;
    }
    if (filter?.endDate) {
      periodMeta.endDate = filter.endDate;
    }

    return {
      generatedAt: new Date().toISOString(),
      period: periodMeta,
      summary,
      statusBreakdown,
      revenueTrend,
    };
  }
}