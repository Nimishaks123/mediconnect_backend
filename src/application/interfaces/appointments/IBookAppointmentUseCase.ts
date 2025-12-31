import { BookAppointmentDTO } from "@application/dtos/appointments/BookAppointmentDTO";
export interface IBookAppointmentUseCase{
    execute(input:BookAppointmentDTO):Promise<void>
}