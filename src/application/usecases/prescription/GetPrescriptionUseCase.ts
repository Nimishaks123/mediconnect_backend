import { IPrescriptionRepository } from "@domain/interfaces/IPrescriptionRepository";
import { IGetPrescriptionUseCase } from "@application/interfaces/prescription/IGetPrescriptionUseCase";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { PrescriptionDetailsDTO } from "@application/dtos/prescription/PrescriptionDetailsDTO";

export class GetPrescriptionUseCase implements IGetPrescriptionUseCase {
  constructor(
    private readonly prescriptionRepo: IPrescriptionRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(
    appointmentId: string,
    userId: string,
    role: string
  ): Promise<PrescriptionDetailsDTO> {
    const prescription =
      (await this.prescriptionRepo.findByAppointmentId(appointmentId)) ||
      (await this.prescriptionRepo.findById(appointmentId));

    if (!prescription) {
      throw new AppError("Prescription not found", StatusCode.NOT_FOUND);
    }

    if (role === "patient" && prescription.getPatientId() !== userId) {
      throw new AppError("Unauthorized", StatusCode.FORBIDDEN);
    }

    if (role === "doctor" && prescription.getDoctorId() !== userId) {
      throw new AppError("Unauthorized", StatusCode.FORBIDDEN);
    }

    const doctor = await this.doctorRepo.findByUserId(prescription.getDoctorId());
    if (!doctor) {
      throw new AppError("Doctor not found", StatusCode.NOT_FOUND);
    }

    const doctorUser = await this.userRepo.findById(doctor.getUserId());
    const appointment = await this.appointmentRepo.findById(prescription.getAppointmentId());

    const patientUserId = appointment?.getPatientId() || prescription.getPatientId();
    const patientUser = await this.userRepo.findById(patientUserId);

    const result: PrescriptionDetailsDTO = {
      prescriptionId: prescription.getId(),
      bookingId: appointment?.getBookingId(),
      appointmentId: prescription.getAppointmentId(),

      patientName: patientUser?.getName() || appointment?.getPatientName(),
      patientId: patientUserId,
      consultationDate: appointment?.getDate(),
      consultationTime: appointment?.getStartTime(),
      consultationMode: "Video Consultation",

      diagnosis: prescription.getDiagnosis(),
      medicines: prescription.getMedicines(),
      notes: prescription.getNotes(),
      createdAt: prescription.getCreatedAt(),

      doctor: {
        name: doctorUser?.getName() ?? "",
        specialty: doctor.getSpecialty(),
        registrationNumber: doctor.getRegistrationNumber(),
      },
    };

    return result;
  }
}