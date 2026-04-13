export class Patient {
  private constructor(
    public readonly userId: string,
    public name: string,
    public age: number, // Keep for backward compatibility fallback
    public gender: "MALE" | "FEMALE" | "OTHER" | null,
    public phone: string,
    public address: string | null = null,
    public profileImage: string | null = null,
    public dateOfBirth: Date | null = null,
    public medicalHistory: Record<string, any> = {},
    public allergies: string[] = [],
    public bloodGroup: string | null = null,
    public emergencyContactName: string | null = null,
    public emergencyContactPhone: string | null = null,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public readonly id?: string
  ) {}

  /**
   * ✅ DDD Factory Method for reconstruction
   */
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

  /**
   * ✅ Domain Factory for new Patient creation
   */
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