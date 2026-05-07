export class Patient {
  private constructor(
    private readonly userId: string,
    private name: string,
    private age: number, 
    private gender: "MALE" | "FEMALE" | "OTHER" | null,
    private phone: string,
    private address: string | null = null,
    private profileImage: string | null = null,
    private dateOfBirth: Date | null = null,
    private medicalHistory: Record<string, any> = {},
    private allergies: string[] = [],
    private bloodGroup: string | null = null,
    private emergencyContactName: string | null = null,
    private emergencyContactPhone: string | null = null,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private readonly id?: string
  ) {}
  getId(): string | undefined {
  return this.id;
}

getUserId(): string {
  return this.userId;
}

getName(): string {
  return this.name;
}

getAge(): number {
  return this.age;
}

getGender(): "MALE" | "FEMALE" | "OTHER" | null {
  return this.gender;
}

getPhone(): string {
  return this.phone;
}

getAddress(): string | null {
  return this.address;
}

getProfileImage(): string | null {
  return this.profileImage;
}

getDateOfBirth(): Date | null {
  return this.dateOfBirth;
}

getMedicalHistory(): Record<string, any> {
  return this.medicalHistory;
}

getAllergies(): string[] {
  return this.allergies;
}

getBloodGroup(): string | null {
  return this.bloodGroup;
}

getEmergencyContactName(): string | null {
  return this.emergencyContactName;
}

getEmergencyContactPhone(): string | null {
  return this.emergencyContactPhone;
}

getCreatedAt(): Date {
  return this.createdAt;
}

getUpdatedAt(): Date {
  return this.updatedAt;
}
  static rehydrate(data: {
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
    createdAt: Date;
    updatedAt: Date;
    id: string;
  }): Patient {
    return new Patient(
      data.userId,
      data.name,
      data.age,
      data.gender,
      data.phone,
      data.address,
      data.profileImage,
      data.dateOfBirth,
      data.medicalHistory,
      data.allergies,
      data.bloodGroup,
      data.emergencyContactName,
      data.emergencyContactPhone,
      data.createdAt,
      data.updatedAt,
      data.id
    );
  }
  static create(data: {
    userId: string;
    name: string;
    age?: number;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    phone: string;
    address?: string | null;
    profileImage?: string | null;
    dateOfBirth?: Date | null;
    medicalHistory?: Record<string, any>;
    allergies?: string[];
    bloodGroup?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
  }): Patient {
    return new Patient(
      data.userId,
      data.name,
      data.age ?? 0,
      data.gender,
      data.phone,
      data.address ?? null,
      data.profileImage ?? null,
      data.dateOfBirth ?? null,
      data.medicalHistory ?? {},
      data.allergies ?? [],
      data.bloodGroup ?? null,
      data.emergencyContactName ?? null,
      data.emergencyContactPhone ?? null,
      new Date(),
      new Date()
    );
  }

  updateTimestamp() {
    this.updatedAt = new Date();
  }

  updateProfile(updates: Partial<{
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
  }>) {
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.age !== undefined) this.age = updates.age;
    if (updates.gender !== undefined) this.gender = updates.gender;
    if (updates.phone !== undefined) this.phone = updates.phone;
    if (updates.address !== undefined) this.address = updates.address;
    if (updates.profileImage !== undefined) this.profileImage = updates.profileImage;
    if (updates.dateOfBirth !== undefined) this.dateOfBirth = updates.dateOfBirth;
    if (updates.medicalHistory !== undefined) this.medicalHistory = updates.medicalHistory;
    if (updates.allergies !== undefined) this.allergies = updates.allergies;
    if (updates.bloodGroup !== undefined) this.bloodGroup = updates.bloodGroup;
    if (updates.emergencyContactName !== undefined) this.emergencyContactName = updates.emergencyContactName;
    if (updates.emergencyContactPhone !== undefined) this.emergencyContactPhone = updates.emergencyContactPhone;

    this.updateTimestamp();
  }
}