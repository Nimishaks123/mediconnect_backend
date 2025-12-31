export interface CreatePatientProfileDTO {
    userId: string;
  
    dateOfBirth: Date | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
  
    medicalHistory?: Record<string, any>;
    allergies?: string[];
    bloodGroup?: string | null;
  
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
  }
  