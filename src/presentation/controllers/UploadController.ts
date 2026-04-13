import { Request, Response } from "express";
import { GetCloudinarySignatureUseCase } from "@application/usecases/upload/GetCloudinarySignatureUseCase";
import { catchAsync } from "../utils/catchAsync";
import { StatusCode } from "@common/enums";

export class UploadController {
  constructor(
    private readonly getSignatureUC: GetCloudinarySignatureUseCase
  ) {}

  getSignature = catchAsync(async (req: Request, res: Response) => {
    const folder = (req.query.folder as string) || "mediconnect/profiles";
    const result = await this.getSignatureUC.execute(folder);
    
    res.status(StatusCode.OK).json(result);
  });
}
