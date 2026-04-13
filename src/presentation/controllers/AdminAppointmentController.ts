import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { AdminMapper } from "../mappers/AdminMapper";
import { GetAdminAppointmentsUseCase } from "@application/usecases/admin/GetAdminAppointmentsUseCase";
import { GetAdminAppointmentDetailsUseCase } from "@application/usecases/admin/GetAdminAppointmentDetailsUseCase";

export class AdminAppointmentController {
  constructor(
    private readonly getAppointmentsUC: GetAdminAppointmentsUseCase,
    private readonly getDetailsUC: GetAdminAppointmentDetailsUseCase
  ) {}

  getAppointments = catchAsync(async (req: Request, res: Response) => {
    const dto = AdminMapper.toGetAdminAppointmentsDTO(req);
    const result = await this.getAppointmentsUC.execute(dto);

    logger.info("Admin fetched appointments", { 
      type: dto.type, 
      page: dto.page, 
      count: result.data.length 
    });
    
    res.status(StatusCode.OK).json(result);
  });

  getAppointmentDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.getDetailsUC.execute(id);

    logger.info("Admin fetched appointment details", { appointmentId: id });
    res.status(StatusCode.OK).json(result);
  });
}
