import { CancelAppointmentByDoctorDTO } from "../../dtos/appointment/CancelAppointmentByDoctorDTO";

export interface ICancelAppointmentByDoctorUseCase {
    execute(dto: CancelAppointmentByDoctorDTO): Promise<void>;
}
