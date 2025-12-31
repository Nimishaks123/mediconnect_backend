export interface IFileStorageService {
  upload(buffer: Buffer, folder: string): Promise<string>;
}
