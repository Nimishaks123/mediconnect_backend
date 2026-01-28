// // // import { Response, NextFunction } from "express";
// // // import { GenerateDoctorSlotsUseCase } from "../../application/usecases/schedule/GenerateDoctorSlotsUseCase";
// // // import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

// // // export class DoctorSlotController {
// // //   constructor(
// // //     private readonly generateSlotsUseCase: GenerateDoctorSlotsUseCase
// // //   ) {}

// // //   async getSlots(
// // //     req: AuthenticatedRequest,
// // //     res: Response,
// // //     next: NextFunction
// // //   ) {
// // //     try {
// // //       const { from, to } = req.query;

// // //       const slots = await this.generateSlotsUseCase.execute(
// // //         req.user.id,
// // //         new Date(from as string),
// // //         new Date(to as string)
// // //       );

// // //       res.status(200).json(slots);
// // //     } catch (error) {
// // //       next(error);
// // //     }
// // //   }
// // // }
// // import { Response, NextFunction } from "express";
// // import { GenerateDoctorSlotsUseCase } from "../../application/usecases/schedule/GenerateDoctorSlotsUseCase";
// // import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

// // export class DoctorSlotController {
// //   constructor(
// //     private readonly generateSlotsUseCase: GenerateDoctorSlotsUseCase
// //   ) {}

// //   // 👨‍⚕️ DOCTOR → view own slots
// //   async getDoctorSlots(
// //     req: AuthenticatedRequest,
// //     res: Response,
// //     next: NextFunction
// //   ) {
// //     try {
// //       const { from, to } = req.query;

// //       const slots = await this.generateSlotsUseCase.execute(
// //         req.user.id, // doctorId from auth
// //         new Date(from as string),
// //         new Date(to as string)
// //       );

// //       res.status(200).json(slots);
// //     } catch (error) {
// //       next(error);
// //     }
// //   }

// //   // 🧑‍⚕️ PATIENT → view selected doctor's slots
// //   async getSlotsForPatient(
// //     req: AuthenticatedRequest,
// //     res: Response,
// //     next: NextFunction
// //   ) {
// //     try {
// //       const { doctorId } = req.params;
// //       const { from, to } = req.query;

// //       const slots = await this.generateSlotsUseCase.execute(
// //         doctorId, // ✅ IMPORTANT FIX
// //         new Date(from as string),
// //         new Date(to as string)
// //       );

// //       res.status(200).json(slots);
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // }
// import { Response, NextFunction } from "express";
// import { GenerateDoctorSlotsUseCase } from "../../application/usecases/schedule/GenerateDoctorSlotsUseCase";
// import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

// export class DoctorSlotController {
//   constructor(
//     private readonly generateSlotsUseCase: GenerateDoctorSlotsUseCase
//   ) {}

//   // 👨‍⚕️ Doctor → own slots
//   async getDoctorSlots(
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { from, to } = req.query;

//       const slots = await this.generateSlotsUseCase.execute(
//         req.user.id, // ✅ doctorId from token
//         new Date(from as string),
//         new Date(to as string)
//       );

//       res.status(200).json(slots);
//     } catch (error) {
//       next(error);
//     }
//   }

//   // 🧑‍⚕️ Patient → selected doctor slots
//   async getSlotsForPatient(
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { doctorId } = req.params;
//       const { from, to } = req.query;

//       const slots = await this.generateSlotsUseCase.execute(
//         doctorId, // doctorId from URL
//         new Date(from as string),
//         new Date(to as string)
//       );

//       res.status(200).json(slots);
//     } catch (error) {
//       next(error);
//     }
//   }
// }
import { Response, NextFunction } from "express";
import { GenerateDoctorSlotsUseCase } from "../../application/usecases/schedule/GenerateDoctorSlotsUseCase";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { AppError } from "../../common/AppError";

export class DoctorSlotController {
  constructor(
    private readonly generateSlotsUseCase: GenerateDoctorSlotsUseCase
  ) {}

  /**
   * 👨‍⚕️ Doctor → view own slots
   * GET /api/doctor/schedules/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
   */
  async getDoctorSlots(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { from, to } = req.query;

      if (!from || !to) {
        throw new AppError("from and to dates are required", 400);
      }

      const slots = await this.generateSlotsUseCase.execute(
        req.user.id,                 // ✅ doctorId from token
        new Date(from as string),
        new Date(to as string)
      );

      res.status(200).json(slots);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Patient → view selected doctor's slots
   * GET /api/patient/doctors/:doctorId/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
   */
//   async getSlotsForPatient(
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { doctorId } = req.params;
//       const { from, to } = req.query;

//       if (!doctorId) {
//         throw new AppError("doctorId is required", 400);
//       }

//       if (!from || !to) {
//         throw new AppError("from and to dates are required", 400);
//       }

//       const slots = await this.generateSlotsUseCase.execute(
//         doctorId,                    // ✅ FIXED: doctorId from URL
//         new Date(from as string),
//         new Date(to as string)
//       );

//       res.status(200).json(slots);
//     } catch (error) {
//       next(error);
//     }
//   }
async getSlotsForPatient(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { doctorId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "from and to required" });
    }

    const fromDate = new Date(from as string);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(to as string);
    toDate.setHours(23, 59, 59, 999);

    const slots = await this.generateSlotsUseCase.execute(
      doctorId,
      fromDate,
      toDate
    );

    res.status(200).json(slots);
  } catch (error) {
    next(error);
  }
}

}
