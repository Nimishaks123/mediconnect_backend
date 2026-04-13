import cloudinary from "../cloudinary/cloudinary";
import { IFileStorageService } from "@application/interfaces/services/IFileStorageService";
import fs from "fs";
import logger from "@common/logger";

import { config } from "@common/config";

export class CloudinaryService implements IFileStorageService {
  /**
   * Generates a signed upload signature for direct frontend uploads.
   */
  getSignature(folder: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      config.cloudinaryApiSecret!
    );

    return {
      timestamp,
      signature,
      apiKey: config.cloudinaryApiKey!,
      cloudName: config.cloudinaryCloudName!,
    };
  }

  /**
   * Uploads a single file to Cloudinary and returns the secure URL.
   * Deletes the local file after success or failure.
   */
  async uploadSingle(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "mediconnect",
        resource_type: "auto",
      });

      return result.secure_url;
    } catch (error) {
      logger.error("Cloudinary upload failed", { error, filePath: file.path });
      throw error;
    } finally {
      // Step 7: Cleanup local files
      this.deleteLocalFile(file.path);
    }
  }

  /**
   * Uploads multiple files to Cloudinary and returns an array of secure URLs.
   */
  async uploadMultiple(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file) => this.uploadSingle(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Utility to delete local file using fs.unlinkSync
   */
  private deleteLocalFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      logger.error("Failed to delete local file", { err, filePath });
    }
  }
}
