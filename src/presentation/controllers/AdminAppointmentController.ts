import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { AdminAppointmentsQuerySchema } from "../validators/adminAppointment.validator";
import { IGetAdminAppointmentsUseCase } from "@application/interfaces/admin/IGetAdminAppointmentsUseCase";
import { IGetAdminAppointmentDetailsUseCase } from "@application/interfaces/admin/IGetAdminAppointmentDetailsUseCase";

export class AdminAppointmentController {
  constructor(
    private readonly getAppointmentsUC: IGetAdminAppointmentsUseCase,
    private readonly getDetailsUC: IGetAdminAppointmentDetailsUseCase
  ) {}

  getAppointments = catchAsync(async (req: Request, res: Response) => {
    const validated = AdminAppointmentsQuerySchema.parse(req.query);
    const result = await this.getAppointmentsUC.execute(validated);

    logger.info("Admin fetched appointments", { 
      type: validated.type, 
      page: validated.page, 
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
