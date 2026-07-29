import { Types } from "mongoose";
import { AppointmentModel } from "../persistence/models/AppointmentModel";
import { DoctorScheduleModel } from "../persistence/models/DoctorScheduleModel";
import { DoctorSlotWithBookingDTO } from "@application/dtos/appointment/DoctorSlotWithBookingDTO";
import { IAppointmentQueryRepository } from "@application/interfaces/queries/IAppointmentQueryRepository";
import { AppointmentForDoctorDTO } from "@application/dtos/appointment/AppointmentForDoctorDTO";
import { PatientAppointmentDTO } from "@application/dtos/appointment/PatientAppointmentDTO";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { PaymentStatus } from "@domain/enums/PaymentStatus";

import { AdminAppointmentListItemDTO, AdminAppointmentDetailsDTO } from "@application/dtos/admin/AdminAppointmentDTO";

export class AppointmentQueryRepository implements IAppointmentQueryRepository {
  async findAdminAppointments(
    page: number,
    limit: number,
    type: "UPCOMING" | "PAST" | "RECENT",
    status?: string,
    search?: string,
    sort?: "LATEST" | "OLDEST"
  ): Promise<{ data: AdminAppointmentListItemDTO[]; total: number }> {
    const today = new Date().toISOString().split("T")[0];
    const skip = (page - 1) * limit;

    const match: any = {};
    if (type === "UPCOMING") {
      match.date = { $gte: today };
    } else if (type === "PAST") {
      match.date = { $lt: today };
    } else if (type === "RECENT") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      match.date = { $gte: sevenDaysAgo.toISOString().split("T")[0] };
    }

    if (status) {
      match.status = status;
    }

    if (search) {
      const isObjectId = Types.ObjectId.isValid(search);
      const searchRegex = new RegExp(search, "i");
      
      const doctorUserMatches = await AppointmentModel.aggregate([
        {
          $lookup: {
            from: "doctors",
            localField: "doctorId",
            foreignField: "_id",
            as: "doc"
          }
        },
        { $unwind: "$doc" },
        {
          $lookup: {
            from: "users",
            localField: "doc.userId",
            foreignField: "_id",
            as: "docUser"
          }
        },
        { $unwind: "$docUser" },
        {
          $lookup: {
            from: "users",
            localField: "patientId",
            foreignField: "_id",
            as: "patUser"
          }
        },
        { $unwind: "$patUser" },
        {
          $match: {
            $or: [
              { "docUser.name": searchRegex },
              { "patUser.name": searchRegex },
              { bookingId: searchRegex },
              { appointmentId: searchRegex }
            ]
          }
        },
        { $project: { _id: 1 } }
      ]);

      const matchingIds = doctorUserMatches.map(m => m._id);

      const orConditions: any[] = [{ _id: { $in: matchingIds } }];
      if (isObjectId) {
        orConditions.push({ _id: new Types.ObjectId(search) });
      }

      match.$or = orConditions;
    }

    const sortOption: any = sort === "OLDEST" ? { date: 1, startTime: 1 } : { date: -1, startTime: -1 };

    const pipeline: any[] = [
      { $match: match },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "doctor.userId",
          foreignField: "_id",
          as: "doctorUser"
        }
      },
      { $unwind: { path: "$doctorUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          as: "patientUser"
        }
      },
      { $unwind: { path: "$patientUser", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$appointmentId",
          bookingId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          paymentStatus: 1,
          price: 1,
          doctorName: { $ifNull: ["$doctorUser.name", "Unknown"] },
          patientName: { $ifNull: ["$patientUser.name", "Unknown"] },
          patientId: { $toString: "$patientUser._id" },
          specialty: { $ifNull: ["$doctor.specialty", "General Medicine"] },
          _id: 0
        }
      }
    ];

    const data = await AppointmentModel.aggregate(pipeline);
    const total = await AppointmentModel.countDocuments(match);

    return { data, total };
  }

  async findAdminAppointmentById(appointmentId: string): Promise<AdminAppointmentDetailsDTO | null> {
    const isObjectId = Types.ObjectId.isValid(appointmentId);
    const matchQuery = isObjectId 
      ? { $or: [{ _id: new Types.ObjectId(appointmentId) }, { appointmentId }] }
      : { appointmentId };

    const pipeline: any[] = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "doctor.userId",
          foreignField: "_id",
          as: "doctorUser"
        }
      },
      { $unwind: { path: "$doctorUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          as: "patientUser"
        }
      },
      { $unwind: { path: "$patientUser", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$appointmentId",
          bookingId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          paymentStatus: 1,
          price: 1,
          cancellationCharge: 1,
          refundAmount: 1,
          createdAt: 1,
          doctor: {
            id: { $toString: "$doctor._id" },
            name: { $ifNull: ["$doctorUser.name", "Unknown"] },
            email: { $ifNull: ["$doctorUser.email", "Unknown"] },
            specialty: { $ifNull: ["$doctor.specialty", "General Medicine"] },
            profilePhoto: { $ifNull: ["$doctor.profilePhoto", null] }
          },
          patient: {
            id: { $toString: "$patientUser._id" },
            name: { $ifNull: ["$patientUser.name", "Unknown"] },
            email: { $ifNull: ["$patientUser.email", "Unknown"] }
          },
          _id: 0
        }
      }
    ];

    const result = await AppointmentModel.aggregate(pipeline);
    return result.length > 0 ? result[0] : null;
  }

  async findByDoctorId(doctorId: string): Promise<AppointmentForDoctorDTO[]> {
    const appointments = await AppointmentModel
      .find({ doctorId: new Types.ObjectId(doctorId) })
      .populate<{ patientId: { _id: Types.ObjectId; name: string; email: string } }>(
        "patientId",
        "name email"
      )
      .sort({ date: -1, startTime: -1 });

    const todayStr = new Date().toISOString().split("T")[0];

    return appointments.map((doc: any) => {
      const videoCallAvailable =
        doc.paymentStatus === "SUCCESS" &&
        doc.date >= todayStr &&
        doc.status !== "CANCELLED";

      return {
        appointmentId: doc.appointmentId,
        bookingId: doc.bookingId,
        patientId: doc.patientId?._id?.toString() ?? "Unknown",
        patientName: doc.patientId?.name ?? "Unknown",
        patientEmail: doc.patientId?.email,
        date: doc.date,
        startTime: doc.startTime,
        endTime: doc.endTime,
        status: doc.status,
        paymentStatus: doc.paymentStatus,
        videoCallAvailable,
      };
    });
  }

  async findByPatientId(patientId: string): Promise<PatientAppointmentDTO[]> {
    const todayStr = new Date().toISOString().split("T")[0];

    await AppointmentModel.updateMany(
      {
        patientId: new Types.ObjectId(patientId),
        status: AppointmentStatus.PAYMENT_PENDING,
        $or: [
          { expiresAt: { $lt: new Date() } },
          { date: { $lt: todayStr } }
        ]
      },
      {
        $set: {
          status: AppointmentStatus.EXPIRED,
          paymentStatus: PaymentStatus.FAILED
        }
      }
    );

    const pipeline: any[] = [
      { $match: { patientId: new Types.ObjectId(patientId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "doctor.userId",
          foreignField: "_id",
          as: "doctorUser"
        }
      },
      { $unwind: { path: "$doctorUser", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$appointmentId",
          bookingId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          paymentStatus: 1,
          price: 1,
          refundAmount: 1,
          cancellationCharge: 1,
          doctor: {
            id: { $toString: "$doctor._id" },
            userId: { $toString: "$doctor.userId" },
            name: { $ifNull: ["$doctorUser.name", "Unknown"] },
            specialty: { $ifNull: ["$doctor.specialty", "Medical Specialist"] },
            profilePhoto: { $ifNull: ["$doctor.profilePhoto", null] },
            experience: { $ifNull: ["$doctor.experience", 0] }
          },
          _id: 0
        }
      }
    ];

    return await AppointmentModel.aggregate(pipeline);
  }

  async findDoctorSlotsWithBooking(doctorId: string, date: string): Promise<DoctorSlotWithBookingDTO[]> {
    const slots = await DoctorScheduleModel.find({ doctorId, date });
    const appointments = await AppointmentModel
      .find({
        doctorId,
        date,
        status: { $in: ["CONFIRMED", "PAYMENT_PENDING"] }
      })
      .populate<{ patientId: { _id: Types.ObjectId; name: string } }>(
        "patientId",
        "name"
      );

    return slots.map((slot: any) => {
      const booked = appointments.find((a: any) =>
        a.startTime === slot.startTime &&
        a.endTime === slot.endTime
      );

      return {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: !!booked,
        appointmentId: booked?.appointmentId,
        patient: booked?.patientId
          ? {
              id: booked.patientId._id.toString(),
              name: booked.patientId.name
            }
          : undefined
      };
    });
  }
}
