import { Types } from "mongoose";
import { AppointmentModel } from "../persistence/models/AppointmentModel";
import { DoctorScheduleModel } from "../persistence/models/DoctorScheduleModel";
import { DoctorSlotWithBookingDTO } from "@application/dtos/appointment/DoctorSlotWithBookingDTO";
import { IAppointmentQueryRepository } from "@application/interfaces/queries/IAppointmentQueryRepository";
import { AppointmentForDoctorDTO } from "@application/dtos/appointment/AppointmentForDoctorDTO";
import { PatientAppointmentDTO } from "@application/dtos/appointment/PatientAppointmentDTO";

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
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
      match.date = { $gte: sevenDaysAgoStr, $lte: today };
    }

    if (status) {
      match.status = status;
    }

    const sortOrder = sort === "OLDEST" ? 1 : -1;
    const sortObj: any = { date: sortOrder, startTime: sortOrder };

    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          as: "patient"
        }
      },
      { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
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
      { $unwind: { path: "$doctorUser", preserveNullAndEmptyArrays: true } }
    ];

    // Add search match if search string exists
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "patient.name": { $regex: search, $options: "i" } },
            { "doctorUser.name": { $regex: search, $options: "i" } },
            { "appointmentId": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    // Since we need the total count AFTER the search match, we'll use a facet or separate count
    // But since matching linked docs requires lookup first, we need a count of the filtered results
    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push({ $sort: sortObj });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    pipeline.push({
      $project: {
        appointmentId: 1,
        patientName: { $ifNull: ["$patient.name", "Unknown"] },
        doctorName: { $ifNull: ["$doctorUser.name", "Unknown"] },
        date: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        paymentStatus: 1,
        _id: 0
      }
    });

    const [data, countResult] = await Promise.all([
      AppointmentModel.aggregate(pipeline),
      AppointmentModel.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    return { data, total };
  }

  async findAdminAppointmentById(id: string): Promise<AdminAppointmentDetailsDTO | null> {
    const pipeline: any[] = [
      { $match: { appointmentId: id } },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          as: "patient"
        }
      },
      { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
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
          appointmentId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          paymentStatus: 1,
          price: 1,
          patient: {
            id: { $toString: "$patient._id" },
            name: { $ifNull: ["$patient.name", "Unknown"] },
            email: { $ifNull: ["$patient.email", "N/A"] },
            phone: { $ifNull: ["$patient.phoneNumber", "N/A"] }
          },
          doctor: {
            id: { $toString: "$doctor._id" },
            name: { $ifNull: ["$doctorUser.name", "Unknown"] },
            specialty: { $ifNull: ["$doctor.specialty", "N/A"] },
            email: { $ifNull: ["$doctorUser.email", "N/A"] }
          },
          _id: 0
        }
      }
    ];

    const results = await AppointmentModel.aggregate(pipeline);
    return results[0] || null;
  }

  async findByDoctorId(doctorId: string): Promise<AppointmentForDoctorDTO[]> {
    const docs = await AppointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      status: { $in: ["CONFIRMED", "RESCHEDULED"] },
    })
      .populate("patientId", "name email")
      .sort({ date: 1, startTime: 1 });

    return docs.map((doc: any) => ({
      appointmentId: doc.appointmentId,
      patientId: doc.patientId?._id?.toString() ?? "Unknown",
      patientName: doc.patientId?.name ?? "Unknown",
      patientEmail: doc.patientId?.email,
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      status: doc.status,
      paymentStatus: doc.paymentStatus,
    }));
  }

  async findByPatientId(patientId: string): Promise<PatientAppointmentDTO[]> {
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
            profilePhoto: { $ifNull: ["$doctor.photo", null] }
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
