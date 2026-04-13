import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { Appointment } from "@domain/entities/Appointment";
import { AppointmentModel } from "../persistence/models/AppointmentModel";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { Types } from "mongoose";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

export class AppointmentRepository implements IAppointmentRepository {

  async save(appointment: Appointment): Promise<void> {
    try {
      await AppointmentModel.updateOne(
        { appointmentId: appointment.getId() },
        {
          $set: {
            appointmentId: appointment.getId(),
            doctorId: new Types.ObjectId(appointment.getDoctorId()),
            patientId: new Types.ObjectId(appointment.getPatientId()),
            date: appointment.getDate(),
            startTime: appointment.getStartTime(),
            endTime: appointment.getEndTime(),
            status: appointment.getStatus(),
            paymentStatus: appointment.getPaymentStatus(),
            price: appointment.getPrice(),
            cancellationCharge: appointment.getCancellationCharge(),
            refundAmount: appointment.getRefundAmount(),
            expiresAt: appointment.getExpiresAt(),
          },
        },
        { upsert: true }
      );
    } catch (error: any) {
      if (error.code === 11000 || error.message.includes("E11000")) {
        throw new AppError("Slot is currently being booked by someone else", StatusCode.CONFLICT);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    const doc = await AppointmentModel.findOne({
      appointmentId: id,
    });

    if (!doc) return null;

    return new Appointment(
      doc.appointmentId,
      doc.doctorId.toString(),
      doc.patientId.toString(),
      doc.date,
      doc.startTime,
      doc.endTime,
      doc.status,
      doc.paymentStatus,
      doc.price,
      doc.cancellationCharge,
      doc.refundAmount,
      doc.expiresAt,
      doc.createdAt
    );
  }

  async findByDoctorAndSlot(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<Appointment | null> {

    const doc = await AppointmentModel.findOne({
      doctorId: new Types.ObjectId(doctorId), 
      date,
      startTime,
      endTime,
      status: { $ne: AppointmentStatus.CANCELLED },
    });

    if (!doc) return null;

    return new Appointment(
      doc.appointmentId,
      doc.doctorId.toString(),
      doc.patientId.toString(),
      doc.date,
      doc.startTime,
      doc.endTime,
      doc.status,
      doc.paymentStatus,
      doc.price,
      doc.cancellationCharge,
      doc.refundAmount,
      doc.expiresAt,
      doc.createdAt
    );
  }

  async existsOverlappingSlot(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: string
  ): Promise<boolean> {

    const query: any = {
      doctorId: new Types.ObjectId(doctorId), 
      date,
      status: {
        $in: [
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.PAYMENT_PENDING,
          AppointmentStatus.RESCHEDULED,
        ],
      },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    };

    if (excludeAppointmentId) {
      query.appointmentId = { $ne: excludeAppointmentId };
    }

    const conflict = await AppointmentModel.findOne(query);

    return !!conflict;
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const docs = await AppointmentModel.find({
      patientId: new Types.ObjectId(patientId), 
    }).sort({ createdAt: -1 });

    return docs.map(
      (doc) =>
        new Appointment(
          doc.appointmentId,
          doc.doctorId.toString(),
          doc.patientId.toString(),
          doc.date,
          doc.startTime,
          doc.endTime,
          doc.status,
          doc.paymentStatus,
          doc.price,
          doc.cancellationCharge,
          doc.refundAmount,
          doc.expiresAt,
          doc.createdAt
        )
    );
  }

  async findByDoctorAndDateRange(
    doctorId: string,
    from: string,
    to: string
  ): Promise<Appointment[]> {

    const docs = await AppointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
      date: { $gte: from, $lte: to },
    });

    return docs.map(
      (doc) =>
        new Appointment(
          doc.appointmentId,
          doc.doctorId.toString(),
          doc.patientId.toString(),
          doc.date,
          doc.startTime,
          doc.endTime,
          doc.status,
          doc.paymentStatus,
          doc.price,
          doc.cancellationCharge,
          doc.refundAmount,
          doc.expiresAt,
          doc.createdAt
        )
    );
  }

  async findAllByDoctorId(doctorId: string): Promise<Appointment[]> {
    const docs = await AppointmentModel.find({
      doctorId: new Types.ObjectId(doctorId),
    }).populate("patientId");

    return docs.map(
      (doc: any) =>
        new Appointment(
          doc.appointmentId,
          doc.doctorId.toString(),
          doc.patientId._id.toString(),
          doc.date,
          doc.startTime,
          doc.endTime,
          doc.status,
          doc.paymentStatus,
          doc.price,
          doc.cancellationCharge,
          doc.refundAmount,
          doc.expiresAt,
          doc.createdAt,
          doc.patientId.name
        )
    );
  }
}