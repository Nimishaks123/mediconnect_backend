import { config } from "@common/config";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

/**
 * Validates that a string is a valid Cloudinary URL belonging to the configured cloud name.
 */
export const validateCloudinaryUrl = (url: string): boolean => {
  if (!url) return false;
  
  const cloudName = config.cloudinaryCloudName;
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME not configured");
  }

  // Example URL: https://res.cloudinary.com/your-cloud-name/image/upload/v12345/sample.jpg
  const pattern = new RegExp(
    `^https?:\\/\\/res\\.cloudinary\\.com\\/${cloudName}\\/image\\/upload\\/.*`,
    "i"
  );

  return pattern.test(url);
};

/**
 * Higher-order function to create a middleware for validating specific fields in the request body.
 */
export const requireValidCloudinaryUrls = (fields: string[]) => {
  return (req: any, res: any, next: any) => {
    for (const field of fields) {
      const url = req.body[field];
      if (url && !validateCloudinaryUrl(url)) {
        throw new AppError(`Invalid Cloudinary URL for field: ${field}`, StatusCode.BAD_REQUEST);
      }
    }
    next();
  };
};
