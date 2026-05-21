export interface IFileStorageService {
   //Uploads a single file to Cloudinary and returns the URL 
   
   
  uploadSingle(file: Express.Multer.File): Promise<string>;

  //Uploads multiple files to Cloudinary and returns URLs.

   uploadMultiple(files: Express.Multer.File[]): Promise<string[]>;
   // Generates  signed upload signature for  frontend uploads to Cloudinary.
  getSignature(folder: string): { 
    timestamp: number; 
    signature: string; 
    apiKey: string; 
    cloudName: string; 
      folder: string;
  };
}
