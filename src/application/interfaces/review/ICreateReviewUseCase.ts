import { CreateReviewDTO } from "@application/dtos/review/CreateReviewDTO";
export interface ICreateReviewUseCase{
    execute(dto:CreateReviewDTO):Promise<void>;
}