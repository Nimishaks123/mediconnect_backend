import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { PaymentStatus } from "@domain/enums/PaymentStatus";

export class Appointment {
  private readonly id: string;
  private readonly doctorId: string;
  private readonly patientId: string;
  private readonly patientName?: string;
  private readonly date: string;
  private readonly startTime: string;
  private readonly endTime: string;
  private status: AppointmentStatus;
  private paymentStatus: PaymentStatus;
  private expiresAt?: Date;
  private readonly createdAt?: Date;
  
  // New fields for wallet/refund logic
  private price: number;
  private cancellationCharge: number;
  private refundAmount: number;

  constructor(
    id: string,
    doctorId: string,
    patientId: string,
    date: string,
    startTime: string,
    endTime: string,
    status: AppointmentStatus,
    paymentStatus: PaymentStatus,
    price: number = 0,
    cancellationCharge: number = 0,
    refundAmount: number = 0,
    expiresAt?: Date,
    createdAt?: Date,
    patientName?: string
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.patientId = patientId;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.price = price;
    this.cancellationCharge = cancellationCharge;
    this.refundAmount = refundAmount;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.patientName = patientName;
  }

  static createPending(
    id: string,
    doctorId: string,
    patientId: string,
    date: string,
    startTime: string,
    endTime: string,
    price: number = 0
  ): Appointment {
    return new Appointment(
      id,
      doctorId,
      patientId,
      date,
      startTime,
      endTime,
      AppointmentStatus.PAYMENT_PENDING,
      PaymentStatus.PENDING,
      price,
      0,
      0,
      new Date(Date.now() + 10 * 60 * 1000)
    );
  }

  getId() { return this.id; }
  getDoctorId() { return this.doctorId; }
  getPatientId() { return this.patientId; }
  getPatientName() { return this.patientName; }
  getDate() { return this.date; }
  getStartTime() { return this.startTime; }
  getEndTime() { return this.endTime; }
  getStatus() { return this.status; }
  getPaymentStatus() { return this.paymentStatus; }
  getExpiresAt() { return this.expiresAt; }
  getCreatedAt() { return this.createdAt; }
  
  getPrice() { return this.price; }
  getCancellationCharge() { return this.cancellationCharge; }
  getRefundAmount() { return this.refundAmount; }

  confirm() {
    if (this.status !== AppointmentStatus.PAYMENT_PENDING) {
      throw new Error("Only pending appointments can be confirmed");
    }
    this.status = AppointmentStatus.CONFIRMED;
    this.paymentStatus = PaymentStatus.SUCCESS;
    this.expiresAt = undefined;
  }

  cancel(charge: number = 0, refund: number = 0) {
    if (this.status === AppointmentStatus.CANCELLED) {
      throw new Error("Appointment is already cancelled");
    }
    this.status = AppointmentStatus.CANCELLED;
    this.paymentStatus = PaymentStatus.REFUNDED;
    this.cancellationCharge = charge;
    this.refundAmount = refund;
  }

  expire() {
    if (this.status !== AppointmentStatus.PAYMENT_PENDING) {
      throw new Error("Only pending appointments can expire");
    }
    this.status = AppointmentStatus.EXPIRED;
    this.paymentStatus = PaymentStatus.FAILED;
  }

  updateDateTime(date: string, startTime: string, endTime: string) {
    (this as any).date = date;
    (this as any).startTime = startTime;
    (this as any).endTime = endTime;
  }

  setStatus(status: AppointmentStatus) {
    this.status = status;
  }

  isUpcoming(): boolean {
    const today = new Date().toISOString().split("T")[0];
    return (
      this.status !== AppointmentStatus.CANCELLED &&
      this.status !== AppointmentStatus.COMPLETED &&
      this.date >= today
    );
  }

  isPast(): boolean {
    const today = new Date().toISOString().split("T")[0];
    return (
      this.status === AppointmentStatus.COMPLETED ||
      this.status === AppointmentStatus.CANCELLED ||
      this.date < today
    );
  }



  canStartVideoCall(): boolean {
    if (this.status !== AppointmentStatus.CONFIRMED && this.status !== AppointmentStatus.RESCHEDULED) {
      return false;
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    if (this.date !== today) return false;

    // Convert startTime (HH:mm) to minutes since midnight
    const [hours, minutes] = this.startTime.split(":").map(Number);
    const startMins = hours * 60 + minutes;
    
    const [endHours, endMinutes] = this.endTime.split(":").map(Number);
    const endMins = endHours * 60 + endMinutes;

    const currentMins = now.getHours() * 60 + now.getMinutes();

    // Available 15 mins before start until the end of the slot
    return currentMins >= (startMins - 15) && currentMins <= endMins;
  }
}
