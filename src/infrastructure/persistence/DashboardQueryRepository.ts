import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";
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
}