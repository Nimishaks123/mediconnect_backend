export type CreatePatientProfileDTO = {
  userId: string;
  name: string;
  // age: number; // Removed from mandatory
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  phone: string;
  address?: string | null;
  profileImage?: string | null;
  dateOfBirth: Date; // Now mandatory
  medicalHistory?: Record<string, any>;
  allergies?: string[];
  bloodGroup?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
};
