import { IFileStorageService } from "@application/interfaces/services/IFileStorageService";

export interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

export class GetCloudinarySignatureUseCase {
  constructor(private readonly fileStorageService: IFileStorageService) {}

  async execute(folder: string): Promise<CloudinarySignatureResponse> {
    return this.fileStorageService.getSignature(folder);
  }
}
