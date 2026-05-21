// import { IFileStorageService } from "@application/interfaces/services/IFileStorageService";

// export interface CloudinarySignatureResponse {
//   timestamp: number;
//   signature: string;
//   apiKey: string;
//   cloudName: string;
// }

// export class GetCloudinarySignatureUseCase {
//   constructor(private readonly fileStorageService: IFileStorageService) {}

//   async execute(folder: string): Promise<CloudinarySignatureResponse> {
//     return this.fileStorageService.getSignature(folder);
//   }
// }
import { IFileStorageService }
from "@application/interfaces/services/IFileStorageService";

import {
  GetCloudinarySignatureDTO
} from "@application/dtos/upload/GetCloudinarySignatureDTO";

import {
  IGetCloudinarySignatureUseCase
} from "@application/interfaces/upload/IGetCloudinarySignatureUseCase";

export interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

export class GetCloudinarySignatureUseCase
implements IGetCloudinarySignatureUseCase {

  constructor(
    private readonly fileStorageService:
      IFileStorageService
  ) {}

  async execute(
    dto: GetCloudinarySignatureDTO
  ): Promise<CloudinarySignatureResponse> {

    return await this.fileStorageService
      .getSignature(dto.folder);

  }
}