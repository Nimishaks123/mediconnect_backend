export type PatientResponseDTO = {
  id?: string;
  userId: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  phone: string;
  address: string | null;
  profileImage: string | null;
  dateOfBirth: Date | null;
  medicalHistory: Record<string, any>;
  allergies: string[];
  bloodGroup: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
};
