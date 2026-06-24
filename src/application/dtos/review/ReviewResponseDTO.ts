export interface ReviewResponseDTO {
  reviewId: string;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}