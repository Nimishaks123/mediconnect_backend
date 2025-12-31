import cloudinary from "../../infrastructure/cloudinary/cloudinary";

export class CloudinaryService {
  async upload(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder, resource_type: "image" },
          (err, result) => {
            if (err) {
              reject(err);
            } else if (!result?.secure_url) {
              reject(new Error("Cloudinary upload failed"));
            } else {
              resolve(result.secure_url); // ✅ RETURN STRING URL ONLY
            }
          }
        )
        .end(buffer);
    });
  }
}
