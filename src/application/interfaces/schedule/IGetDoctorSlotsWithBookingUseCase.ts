import { DoctorSlotWithBookingDTO } from "../../dtos/appointment/DoctorSlotWithBookingDTO";

export interface IGetDoctorSlotsWithBookingUseCase {
    execute({
        doctorUserId,
        from,
        to,
    }: {
        doctorUserId: string;
        from: string;
        to: string;
    }): Promise<DoctorSlotWithBookingDTO[]>;
}
