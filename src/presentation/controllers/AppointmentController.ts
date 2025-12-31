// import { Request, Response, NextFunction } from "express";
// import { StatusCode } from "@common/enums";

// import { IBookAppointmentUseCase } from "@application/interfaces/appointments/IBookAppointmentUseCase";
// import { IGetDoctorAvailabilityUseCase } from "@application/interfaces/appointments/IGetDoctorAvailabilityUseCase";
// import { ICreateDoctorAvailabilityUseCase } from "@application/interfaces/appointments/ICreateDoctorAvailabilityUseCase";
// import { IConfirmAppointmentUseCase } from "@application/interfaces/appointments/IConfirmAppointmentUseCase";
// import { ICancelAppointmentUseCase } from "@application/interfaces/appointments/ICancelAppointmentUseCase";
// import { ICompleteAppointmentUseCase } from "@application/interfaces/appointments/ICompleteAppointmentUseCase";

// export class AppointmentController {
//   constructor(
//     private readonly bookAppointmentUC: IBookAppointmentUseCase,
//     private readonly getAvailabilityUC: IGetDoctorAvailabilityUseCase,
//     private readonly createAvailabilityUC: ICreateDoctorAvailabilityUseCase,
//     private readonly confirmAppointmentUC: IConfirmAppointmentUseCase,
//     private readonly cancelAppointmentUC: ICancelAppointmentUseCase,
//     private readonly completeAppointmentUC: ICompleteAppointmentUseCase
//   ) {}

//   /* =========================
//      PATIENT: BOOK APPOINTMENT
//      ========================= */
//   bookAppointment = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       await this.bookAppointmentUC.execute({
//         doctorId: req.body.doctorId,
//         patientId: (req as any).user.id,
//         availabilityId: req.body.availabilityId,
//       });

//       res.status(StatusCode.CREATED).json({
//         message: "Appointment booked successfully",
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

//   /* =========================
//      PUBLIC: GET AVAILABILITY
//      ========================= */
//   getDoctorAvailability = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const result = await this.getAvailabilityUC.execute({
//         doctorId: req.params.doctorId,
//         date: req.query.date as string,
//       });

//       res.status(StatusCode.OK).json(result);
//     } catch (error) {
//       next(error);
//     }
//   };

//   /* =========================
//      DOCTOR: SET AVAILABILITY
//      ========================= */
//   createAvailability = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       await this.createAvailabilityUC.execute({
//         doctorId: (req as any).user.id,
//         date: req.body.date,
//         slots: req.body.slots,
//       });

//       res.status(StatusCode.CREATED).json({
//         message: "Availability created successfully",
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

//   /* =========================
//      DOCTOR: CONFIRM
//      ========================= */
//   confirmAppointment = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       await this.confirmAppointmentUC.execute({
//         appointmentId: req.params.id,
//         doctorId: (req as any).user.id,
//       });

//       res.status(StatusCode.OK).json({
//         message: "Appointment confirmed",
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

//   /* =========================
//      DOCTOR / PATIENT: CANCEL
//      ========================= */
//   cancelAppointment = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       await this.cancelAppointmentUC.execute({
//         appointmentId: req.params.id,
//         actorId: (req as any).user.id,
//       });

//       res.status(StatusCode.OK).json({
//         message: "Appointment cancelled",
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

//   /* =========================
//      DOCTOR: COMPLETE
//      ========================= */
//   completeAppointment = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       await this.completeAppointmentUC.execute({
//         appointmentId: req.params.id,
//         doctorId: (req as any).user.id,
//       });

//       res.status(StatusCode.OK).json({
//         message: "Appointment completed",
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
// }
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "@common/enums";

import { IBookAppointmentUseCase } from "@application/interfaces/appointments/IBookAppointmentUseCase";
import { IGetDoctorAvailabilityUseCase } from "@application/interfaces/appointments/IGetDoctorAvailabilityUseCase";
import { ICreateDoctorAvailabilityUseCase } from "@application/interfaces/appointments/ICreateDoctorAvailabilityUseCase";
import { IConfirmAppointmentUseCase } from "@application/interfaces/appointments/IConfirmAppointmentUseCase";
import { ICancelAppointmentUseCase } from "@application/interfaces/appointments/ICancelAppointmentUseCase";
import { ICompleteAppointmentUseCase } from "@application/interfaces/appointments/ICompleteAppointmentUseCase";

export class AppointmentController {
  constructor(
    private readonly bookAppointmentUC: IBookAppointmentUseCase,
    private readonly getAvailabilityUC: IGetDoctorAvailabilityUseCase,
    private readonly createAvailabilityUC: ICreateDoctorAvailabilityUseCase,
    private readonly confirmAppointmentUC: IConfirmAppointmentUseCase,
    private readonly cancelAppointmentUC: ICancelAppointmentUseCase,
    private readonly completeAppointmentUC: ICompleteAppointmentUseCase
  ) {}

  bookAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.bookAppointmentUC.execute({
        doctorId: req.body.doctorId,
        patientId: (req as any).user.id,
        availabilityId: req.body.availabilityId,
      });

      res.status(StatusCode.CREATED).json({
        message: "Appointment booked successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getDoctorAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.getAvailabilityUC.execute({
        doctorId: req.params.doctorId,
        date: req.query.date as string,
      });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  createAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.createAvailabilityUC.execute({
        doctorId: (req as any).user.id,
        date: req.body.date,
        slots: req.body.slots,
      });

      res.status(StatusCode.CREATED).json({
        message: "Availability created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  confirmAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.confirmAppointmentUC.execute({
        appointmentId: req.params.id,
        doctorId: (req as any).user.id,
      });

      res.status(StatusCode.OK).json({ message: "Appointment confirmed" });
    } catch (error) {
      next(error);
    }
  };

  cancelAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.cancelAppointmentUC.execute({
        appointmentId: req.params.id,
        actorId: (req as any).user.id,
      });

      res.status(StatusCode.OK).json({ message: "Appointment cancelled" });
    } catch (error) {
      next(error);
    }
  };

  completeAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.completeAppointmentUC.execute({
        appointmentId: req.params.id,
        doctorId: (req as any).user.id,
      });

      res.status(StatusCode.OK).json({ message: "Appointment completed" });
    } catch (error) {
      next(error);
    }
  };
}
