import { IPaymentService } from "@application/interfaces/services/IPaymentService";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { PaymentStatus } from "@domain/enums/PaymentStatus";

export class CreateCheckoutSessionUseCase {
    constructor(
        private readonly appointmentRepo: IAppointmentRepository,
        private readonly paymentService: IPaymentService
    ) {}

    async execute({ appointmentId, patientId }: { appointmentId: string, patientId: string }) {
        // get appointment
        const appointment = await this.appointmentRepo.findById(appointmentId);
        if (!appointment) {
            throw new AppError("Appointment not found", StatusCode.NOT_FOUND);
        }

        // security check
        if (appointment.getPatientId() !== patientId) {
            throw new AppError("Unauthorized", StatusCode.FORBIDDEN);
        }
        if (appointment.getPaymentStatus() === PaymentStatus.SUCCESS) {
            throw new AppError("Appointment already paid", StatusCode.BAD_REQUEST);
        }

        const amount = appointment.getPrice();
        if (!amount || amount <= 0) {
            throw new AppError("Invalid Appointment price", StatusCode.BAD_REQUEST);
        }

        const session = await this.paymentService.createCheckoutSession({
            appointmentId,
            patientId,
            amount,
        });

        return session;
    }
}
