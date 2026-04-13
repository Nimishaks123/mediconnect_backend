import { catchAsync } from '@presentation/utils/catchAsync';
import { AuthenticatedRequest } from '@presentation/middlewares/authMiddleware';
import { Response } from 'express';
import { StatusCode } from '@common/enums';
import {
  GetDoctorAppointmentsUseCase,
  RescheduleAppointmentUseCase,
  CancelAppointmentUseCase,
} from '@application/usecases/appointment';
import { IDoctorRepository } from '@domain/interfaces/IDoctorRepository';
import { AppError } from '@common/AppError';
import { AppointmentPresentationMapper } from '../mappers/appointment/AppointmentPresentationMapper';

export class DoctorAppointmentController {
  constructor(
    private readonly getDoctorAppointmentsUC: GetDoctorAppointmentsUseCase,
    private readonly rescheduleAppointmentUC: RescheduleAppointmentUseCase,
    private readonly cancelAppointmentUC: CancelAppointmentUseCase,
    private readonly doctorRepo: IDoctorRepository
  ) {}

  private async resolveDoctorId(userId: string): Promise<string> {
    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) throw new AppError('Doctor profile not found', 404);
    return doctor.getId();
  }

  getAppointments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = await this.resolveDoctorId(req.user!.id);
    const result = await this.getDoctorAppointmentsUC.execute(doctorId);
    
    const data = AppointmentPresentationMapper.toGroupedDoctorAppointmentsDTO(result);
    res.status(StatusCode.OK).json({ success: true, data });
  });

  cancel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = await this.resolveDoctorId(req.user!.id);
    const dto = AppointmentPresentationMapper.toCancelByDoctorDTO(req, doctorId);

    await this.cancelAppointmentUC.execute(dto);
    res.status(StatusCode.OK).json({ success: true, message: 'Appointment cancelled' });
  });

  reschedule = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const doctorId = await this.resolveDoctorId(req.user!.id);
    const dto = AppointmentPresentationMapper.toRescheduleAppointmentDTO(req, doctorId);

    await this.rescheduleAppointmentUC.execute(dto);
    res.status(StatusCode.OK).json({ success: true, message: 'Appointment rescheduled' });
  });
}
