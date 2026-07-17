import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";
import { RevenueTrendDTO } from "@application/dtos/admin/RevenueTrendDTO";
import { AppointmentStatusAnalyticsDTO } from "@application/dtos/admin/AppointmentStatusAnalyticsDTO";
import { IDashboardQueryRepository } from "@application/interfaces/queries/IDashboardQueryRepository";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { PaymentStatus } from "@domain/enums/PaymentStatus";
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

    return {
      totalRevenue:
        revenueResult[0]?.totalRevenue ?? 0,

      platformRevenue:
        platformWallet?.balance ?? 0,

      totalPatients,

      totalDoctors,

      totalAppointments,

      todayAppointments,
    };
  }

  async getRevenueTrend(): Promise<RevenueTrendDTO> {
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
}