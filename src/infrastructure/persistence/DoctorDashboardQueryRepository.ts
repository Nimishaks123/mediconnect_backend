import mongoose from "mongoose";
import { RecentActivityDTO } from "@application/dtos/doctor/RecentActivityDTO";
import { IDoctorDashboardQueryRepository } from "@application/interfaces/queries/IDoctorDashboardQueryRepository";
import { ActivityType } from "@domain/enums/ActivityType";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { TransactionType } from "@domain/enums/TransactionType";
import { TransactionStatus } from "@domain/enums/TransactionStatus";
import { AppointmentModel } from "./models/AppointmentModel";
import { PrescriptionModel } from "./models/PrescriptionModel";
import { ReviewModel } from "./models/ReviewModel";
import { WalletTransactionModel } from "./models/WalletTransactionModel";
import { WalletModel } from "./models/WalletModel";

export class DoctorDashboardQueryRepository implements IDoctorDashboardQueryRepository {
  async getRecentActivity(doctorId: string): Promise<RecentActivityDTO> {
    const docId = new mongoose.Types.ObjectId(doctorId);

    // Get doctor's wallet
    const wallet = await WalletModel.findOne({ userId: docId });

    const [appointments, prescriptions, reviews, transactions] = await Promise.all([
      // 1. Appointments
      AppointmentModel.aggregate([
        {
          $match: {
            doctorId: docId,
            status: {
              $in: [
                AppointmentStatus.CONFIRMED,
                AppointmentStatus.COMPLETED,
                AppointmentStatus.CANCELLED,
              ],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        { $unwind: "$patient" },
        {
          $project: {
            type: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", AppointmentStatus.CONFIRMED] }, then: ActivityType.APPOINTMENT_BOOKED },
                  { case: { $eq: ["$status", AppointmentStatus.COMPLETED] }, then: ActivityType.APPOINTMENT_COMPLETED },
                  { case: { $eq: ["$status", AppointmentStatus.CANCELLED] }, then: ActivityType.APPOINTMENT_CANCELLED },
                ],
                default: ActivityType.APPOINTMENT_BOOKED,
              },
            },
            title: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", AppointmentStatus.CONFIRMED] }, then: "Appointment Booked" },
                  { case: { $eq: ["$status", AppointmentStatus.COMPLETED] }, then: "Appointment Completed" },
                  { case: { $eq: ["$status", AppointmentStatus.CANCELLED] }, then: "Appointment Cancelled" },
                ],
                default: "Appointment Booked",
              },
            },
            description: "$patient.name",
            createdAt: 1,
          },
        },
      ]),

      // 2. Prescriptions
      PrescriptionModel.aggregate([
        { $match: { doctorId: docId } },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        { $unwind: "$patient" },
        {
          $project: {
            type: { $literal: ActivityType.PRESCRIPTION_CREATED },
            title: { $literal: "Prescription Created" },
            description: "$patient.name",
            createdAt: 1,
          },
        },
      ]),

      // 3. Reviews
      ReviewModel.aggregate([
        { $match: { doctorId: docId } },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $project: {
            type: { $literal: ActivityType.NEW_REVIEW_RECEIVED },
            title: { $literal: "New Review" },
            description: {
              $concat: [
                {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$rating", 5] }, then: "★★★★★ " },
                      { case: { $eq: ["$rating", 4] }, then: "★★★★☆ " },
                      { case: { $eq: ["$rating", 3] }, then: "★★★☆☆ " },
                      { case: { $eq: ["$rating", 2] }, then: "★★☆☆☆ " },
                      { case: { $eq: ["$rating", 1] }, then: "★☆☆☆☆ " },
                    ],
                    default: "★ ",
                  },
                },
                "$comment",
              ],
            },
            createdAt: 1,
          },
        },
      ]),

      // 4. Wallet Transactions
      wallet ? WalletTransactionModel.aggregate([
        {
          $match: {
            walletId: wallet._id,
            type: TransactionType.CREDIT,
            status: TransactionStatus.SUCCESS,
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $project: {
            type: { $literal: ActivityType.WALLET_CREDITED },
            title: { $literal: "Wallet Credited" },
            description: "$description",
            createdAt: 1,
          },
        },
      ]) : Promise.resolve([]),
    ]);

    const combined = [
      ...appointments,
      ...prescriptions,
      ...reviews,
      ...transactions,
    ];

    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return combined.slice(0, 10).map(item => ({
      type: item.type,
      title: item.title,
      description: item.description,
      createdAt: item.createdAt.toISOString(),
    }));
  }
}
