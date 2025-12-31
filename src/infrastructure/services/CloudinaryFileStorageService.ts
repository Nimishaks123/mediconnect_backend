import cloudinary from "../cloudinary/cloudinary";
import { IFileStorageService } from "@application/interfaces/services/IFileStorageService";

export class CloudinaryFileStorageService
  implements IFileStorageService
{
  async upload(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder, resource_type: "image" },
          (error, result) => {
            if (error || !result) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        )
        .end(buffer);
    });
  }
}
