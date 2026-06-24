export interface CreateReviewDTO {
  appointmentId: string;
  patientId: string;
  rating: number;
  comment: string;
}