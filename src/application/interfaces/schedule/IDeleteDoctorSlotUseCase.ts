import { DeleteSlotDTO } from "../../dtos/schedule/DeleteSlotDTO";

export interface IDeleteDoctorSlotUseCase {
    execute(dto: DeleteSlotDTO): Promise<void>;
}
