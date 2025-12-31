export class Patient {
    constructor(
      public userId: string,  
  
      public dateOfBirth: Date | null,
      public gender: "MALE" | "FEMALE" | "OTHER" | null,
  
      public medicalHistory: Record<string, any> = {},
      public allergies: string[] = [],
  
      public bloodGroup: string | null = null,

      public emergencyContactName: string | null = null,
      public emergencyContactPhone: string | null = null,
  
      public createdAt: Date = new Date(),
      public updatedAt: Date = new Date(),
  
      public id?: string
    ) {}
  
    updateTimestamp() {
      this.updatedAt = new Date();
    }
  }
  