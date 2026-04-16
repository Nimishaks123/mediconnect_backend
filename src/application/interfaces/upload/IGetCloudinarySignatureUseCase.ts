import { CloudinarySignatureResponse } from "../../usecases/upload/GetCloudinarySignatureUseCase";
import { GetCloudinarySignatureDTO } from "../../dtos/upload/GetCloudinarySignatureDTO";

export interface IGetCloudinarySignatureUseCase {
  execute(dto: GetCloudinarySignatureDTO): Promise<CloudinarySignatureResponse>;
}
