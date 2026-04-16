import { Request, Response } from "express";
import { IGetCloudinarySignatureUseCase } from "@application/interfaces/upload/IGetCloudinarySignatureUseCase";
import { catchAsync } from "../utils/catchAsync";
import { StatusCode } from "@common/enums";
import { GetCloudinarySignatureSchema } from "../validators/upload.validator";

export class UploadController {
  constructor(
    private readonly getSignatureUC: IGetCloudinarySignatureUseCase
  ) {}

  getSignature = catchAsync(async (req: Request, res: Response) => {
    const dto = GetCloudinarySignatureSchema.parse({
      folder: req.query.folder,
    });

    const result = await this.getSignatureUC.execute(dto);
    
    res.status(StatusCode.OK).json(result);
  });
}
