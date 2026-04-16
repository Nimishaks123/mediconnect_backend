import { catchAsync } from '@presentation/utils/catchAsync';
import { AuthenticatedRequest } from '@presentation/middlewares/authMiddleware';
import { Response } from 'express';
import { StatusCode } from '@common/enums';
import { AppError } from '@common/AppError';
import { AppointmentPresentationMapper } from '../mappers/appointment/AppointmentPresentationMapper';
import {
  IGetDoctorAppointmentsUseCase
} from '@application/interfaces/appointment/IGetDoctorAppointmentsUseCase';
import {
  IRescheduleAppointmentUseCase
} from '@application/interfaces/appointment/IRescheduleAppointmentUseCase';
import { RescheduleAppointmentDTO } from '@application/dtos/appointment/RescheduleAppointmentDTO';
import {
  ICancelAppointmentByDoctorUseCase
} from '@application/interfaces/appointment/ICancelAppointmentByDoctorUseCase';

export class DoctorAppointmentController {
  constructor(
    private readonly getDoctorAppointmentsUC: IGetDoctorAppointmentsUseCase,
    private readonly rescheduleAppointmentUC: IRescheduleAppointmentUseCase,
    private readonly cancelAppointmentUC: ICancelAppointmentByDoctorUseCase
  ) {}


  getAppointments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const result = await this.getDoctorAppointmentsUC.execute(req.user.id);
    const data = AppointmentPresentationMapper.toGroupedDoctorAppointmentsDTO(result);
    res.status(StatusCode.OK).json(data);
  });

  cancel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const { id } = req.params;
    const { reason } = req.body;
    
    const cancelDTO = {
      appointmentId: id,
      doctorId: req.user.id,
      reason: reason,
    };

    await this.cancelAppointmentUC.execute(cancelDTO);
    res.status(StatusCode.OK).json({ success: true, message: 'Appointment cancelled' });
  });

  reschedule = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const { id } = req.params;
    const { newSlotId, reason } = req.body;

    const rescheduleDTO: RescheduleAppointmentDTO = {
      appointmentId: id,
      doctorId: req.user.id,
      newDateTime: newSlotId, 
      reason: reason,
    };

    await this.rescheduleAppointmentUC.execute(rescheduleDTO);
    res.status(StatusCode.OK).json({ success: true, message: 'Appointment rescheduled' });
  });
}
