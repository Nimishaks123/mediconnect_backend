export class DoctorApprovedEvent {
  constructor(
    public readonly doctorId: string,
    public readonly userId: string,
    public readonly adminId: string
  ) {}
}
