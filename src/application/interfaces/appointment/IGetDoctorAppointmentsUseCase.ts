import { GroupedAppointments } from "../../usecases/appointment/GetDoctorAppointmentsUseCase";

export interface IGetDoctorAppointmentsUseCase {
    execute(doctorId: string): Promise<GroupedAppointments>;
}
