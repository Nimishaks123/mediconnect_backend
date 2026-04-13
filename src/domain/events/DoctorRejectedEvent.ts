export class DoctorRejectedEvent {
  constructor(
    public readonly doctorId: string,
    public readonly userId: string,
    public readonly adminId: string,
    public readonly reason: string
  ) {}
}
