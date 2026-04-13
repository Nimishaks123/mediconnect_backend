export interface IFileStorageService {
  /**
   * Uploads a single file to Cloudinary and returns the secure URL.
   * Also handles local file cleanup.
   */
  uploadSingle(file: Express.Multer.File): Promise<string>;

  /**
   * Uploads multiple files to Cloudinary and returns an array of secure URLs.
   * Also handles local file cleanup.
   */
  uploadMultiple(files: Express.Multer.File[]): Promise<string[]>;
  /**
   * Generates a signed upload signature for direct frontend uploads to Cloudinary.
   */
  getSignature(folder: string): { 
    timestamp: number; 
    signature: string; 
    apiKey: string; 
    cloudName: string; 
  };
}
