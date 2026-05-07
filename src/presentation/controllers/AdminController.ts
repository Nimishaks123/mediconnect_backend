// import { Request, Response} from "express";
// import logger from "@common/logger";
// import { StatusCode } from "@common/enums";
// import { catchAsync } from "../utils/catchAsync";
// import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
// import { 
//   AdminLoginSchema, 
//   AdminDoctorsQuerySchema, 
//   ApproveDoctorSchema, 
//   RejectDoctorSchema, 
//   BlockUnblockUserSchema, 

// } from "../validators/admin.validator";
// import { GetAllUsersDTO } from "@application/dtos/admin";

// import { IAdminLoginUseCase } from "@application/interfaces/admin/IAdminLoginUseCase";
// import { IGetAdminDoctorsUseCase } from "@application/interfaces/admin/IGetAdminDoctorsUseCase";
// import { IApproveDoctorUseCase } from "@application/interfaces/admin/IApproveDoctorUseCase";
// import { IRejectDoctorUseCase } from "@application/interfaces/admin/IRejectDoctorUseCase";
// import { IBlockUnblockUserUseCase } from "@application/interfaces/admin/IBlockUnblockUserUseCase";
// import { IGetAllUsersUseCase } from "@application/interfaces/admin/IGetAllUsersUseCase";

// import { AdminLoginOutputDTO } from "@application/dtos/admin/AdminLoginDTO";
// import { ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
// import { RejectDoctorResponseDTO } from "@application/dtos/admin/RejectDoctorDTO";
// import { BlockUnblockUserResponseDTO } from "@application/dtos/admin/BlockUnblockUserDTO";


// export class AdminController {
//   constructor(
//     private readonly adminLoginUseCase: IAdminLoginUseCase,
//     private readonly getAdminDoctorsUseCase: IGetAdminDoctorsUseCase,
//     private readonly approveDoctorUseCase: IApproveDoctorUseCase,
//     private readonly rejectDoctorUseCase: IRejectDoctorUseCase,
//     private readonly blockUnblockUserUseCase: IBlockUnblockUserUseCase,
//     private readonly getAllUsersUseCase: IGetAllUsersUseCase
//   ) {}

//   login = catchAsync(async (req: Request, res: Response) => {
//     const result = await this.adminLoginUseCase.execute(req.body);

//     logger.info("Admin login successful", { email: req.body.email });
//     res.status(StatusCode.OK).json(result);
//   });

//   getDoctors = catchAsync(async (req: Request, res: Response) => {
//     const validated = AdminDoctorsQuerySchema.parse(req.query);
//     const result = await this.getAdminDoctorsUseCase.execute(validated);

//     logger.info("Admin fetched doctors list", { status: validated.status, total: result.total, page: validated.page });
//     res.status(StatusCode.OK).json(result);
//   });

//   approveDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
//     const validated = ApproveDoctorSchema.parse({
//       userId: req.body.userId,
//       adminId: req.user?.id
//     });
//     const result: ApproveRejectDoctorResponseDTO = await this.approveDoctorUseCase.execute(validated);

//     logger.info("Doctor approved", { userId: validated.userId, adminId: validated.adminId });
//     res.status(StatusCode.OK).json(result);
//   });

//   rejectDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
//     const validated = RejectDoctorSchema.parse({
//       userId: req.body.userId,
//       reason: req.body.reason,
//       adminId: req.user?.id
//     });
//     const result: RejectDoctorResponseDTO = await this.rejectDoctorUseCase.execute(validated);

//     logger.info("Doctor rejected", { userId: validated.userId, adminId: validated.adminId });
//     res.status(StatusCode.OK).json(result);
//   });

//   blockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
//     const validated = BlockUnblockUserSchema.parse({
//       userId: req.body.userId,
//       adminId: req.user?.id
//     });
//     const result: BlockUnblockUserResponseDTO = await this.blockUnblockUserUseCase.block(validated);

//     logger.info("User blocked", { userId: validated.userId, adminId: validated.adminId });
//     res.status(StatusCode.OK).json(result);
//   });

//   unblockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
//     const validated = BlockUnblockUserSchema.parse({
//       userId: req.body.userId,
//       adminId: req.user?.id
//     });
//     const result: BlockUnblockUserResponseDTO = await this.blockUnblockUserUseCase.unblock(validated);

//     logger.info("User unblocked", { userId: validated.userId, adminId: validated.adminId });
//     res.status(StatusCode.OK).json(result);
//   });

//   getAllUsers = catchAsync(async (req: Request, res: Response) => {
//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     //const validated = req.query;
//     const query=req.query;


// const validated: GetAllUsersDTO = {
//   page: query.page ? Number(query.page) : 1,
//   limit: query.limit ? Number(query.limit) : 6,
//   search: query.search as string | undefined,
//   role: query.role as string | undefined,
//   status: query.status as "ACTIVE" | "BLOCKED" | undefined,
// };
//     const result = await this.getAllUsersUseCase.execute(validated);

//     logger.info("Fetched users with pagination", {
//       count: result.users.length,
//       page: result.page,
//       limit: result.limit,
//       total: result.total,
//     });

//     res.status(StatusCode.OK).json(result);
//   });
// }
// // import { Request, Response } from "express";
// // import logger from "@common/logger";
// // import { StatusCode } from "@common/enums";
// // import { catchAsync } from "../utils/catchAsync";
// // import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

// // import { GetAllUsersDTO } from "@application/dtos/admin";

// // import { IAdminLoginUseCase } from "@application/interfaces/admin/IAdminLoginUseCase";
// // import { IGetAdminDoctorsUseCase } from "@application/interfaces/admin/IGetAdminDoctorsUseCase";
// // import { IApproveDoctorUseCase } from "@application/interfaces/admin/IApproveDoctorUseCase";
// // import { IRejectDoctorUseCase } from "@application/interfaces/admin/IRejectDoctorUseCase";
// // import { IBlockUnblockUserUseCase } from "@application/interfaces/admin/IBlockUnblockUserUseCase";
// // import { IGetAllUsersUseCase } from "@application/interfaces/admin/IGetAllUsersUseCase";

// // import { AdminLoginOutputDTO } from "@application/dtos/admin/AdminLoginDTO";
// // import { ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
// // import { RejectDoctorResponseDTO } from "@application/dtos/admin/RejectDoctorDTO";
// // import { BlockUnblockUserResponseDTO } from "@application/dtos/admin/BlockUnblockUserDTO";

// // export class AdminController {
// //   constructor(
// //     private readonly adminLoginUseCase: IAdminLoginUseCase,
// //     private readonly getAdminDoctorsUseCase: IGetAdminDoctorsUseCase,
// //     private readonly approveDoctorUseCase: IApproveDoctorUseCase,
// //     private readonly rejectDoctorUseCase: IRejectDoctorUseCase,
// //     private readonly blockUnblockUserUseCase: IBlockUnblockUserUseCase,
// //     private readonly getAllUsersUseCase: IGetAllUsersUseCase
// //   ) {}

// //   // ✅ Validation handled in middleware → safe to use req.body
// //   login = catchAsync(async (req: Request, res: Response) => {
// //     const result: AdminLoginOutputDTO =
// //       await this.adminLoginUseCase.execute(req.body);

// //     logger.info("Admin login successful", { email: req.body.email });

// //     res.status(StatusCode.OK).json(result);
// //   });

// //   // ✅ req.query already validated & transformed by middleware
// //   getDoctors = catchAsync(async (req: Request, res: Response) => {
// //     const result = await this.getAdminDoctorsUseCase.execute(req.query);

// //     logger.info("Admin fetched doctors list", {
// //       status: req.query.status,
// //       total: result.total,
// //       page: req.query.page,
// //     });

// //     res.status(StatusCode.OK).json(result);
// //   });

// //   // ⚠️ needs adminId from req.user → still manual combine
// //   approveDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
// //     const input = {
// //       userId: req.body.userId,
// //       adminId: req.user?.id,
// //     };

// //     const result: ApproveRejectDoctorResponseDTO =
// //       await this.approveDoctorUseCase.execute(input);

// //     logger.info("Doctor approved", input);

// //     res.status(StatusCode.OK).json(result);
// //   });

// //   rejectDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
// //     const input = {
// //       userId: req.body.userId,
// //       reason: req.body.reason,
// //       adminId: req.user?.id,
// //     };

// //     const result: RejectDoctorResponseDTO =
// //       await this.rejectDoctorUseCase.execute(input);

// //     logger.info("Doctor rejected", input);

// //     res.status(StatusCode.OK).json(result);
// //   });

// //   blockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
// //     const input = {
// //       userId: req.body.userId,
// //       adminId: req.user?.id,
// //     };

// //     const result: BlockUnblockUserResponseDTO =
// //       await this.blockUnblockUserUseCase.block(input);

// //     logger.info("User blocked", input);

// //     res.status(StatusCode.OK).json(result);
// //   });

// //   unblockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
// //     const input = {
// //       userId: req.body.userId,
// //       adminId: req.user?.id,
// //     };

// //     const result: BlockUnblockUserResponseDTO =
// //       await this.blockUnblockUserUseCase.unblock(input);

// //     logger.info("User unblocked", input);

// //     res.status(StatusCode.OK).json(result);
// //   });

// //   getAllUsers = catchAsync(async (req: Request, res: Response) => {
// //     // disable caching
// //     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
// //     res.setHeader("Pragma", "no-cache");
// //     res.setHeader("Expires", "0");

// //     const query = req.query;

// //     // 🔥 still needed because no schema used here
// //     const validated: GetAllUsersDTO = {
// //       page: query.page ? Number(query.page) : 1,
// //       limit: query.limit ? Number(query.limit) : 6,
// //       search: query.search as string | undefined,
// //       role: query.role as string | undefined,
// //       status: query.status as "ACTIVE" | "BLOCKED" | undefined,
// //     };

// //     const result = await this.getAllUsersUseCase.execute(validated);

// //     logger.info("Fetched users with pagination", {
// //       count: result.users.length,
// //       page: result.page,
// //       limit: result.limit,
// //       total: result.total,
// //     });

// //     res.status(StatusCode.OK).json(result);
// //   });
// // }
import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { AppError } from "@common/AppError";
import { GetAllUsersDTO } from "@application/dtos/admin";

import { IAdminLoginUseCase } from "@application/interfaces/admin/IAdminLoginUseCase";
import { IGetAdminDoctorsUseCase } from "@application/interfaces/admin/IGetAdminDoctorsUseCase";
import { IApproveDoctorUseCase } from "@application/interfaces/admin/IApproveDoctorUseCase";
import { IRejectDoctorUseCase } from "@application/interfaces/admin/IRejectDoctorUseCase";
import { IBlockUnblockUserUseCase } from "@application/interfaces/admin/IBlockUnblockUserUseCase";
import { IGetAllUsersUseCase } from "@application/interfaces/admin/IGetAllUsersUseCase";

import { AdminLoginOutputDTO } from "@application/dtos/admin/AdminLoginDTO";
import { ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { RejectDoctorResponseDTO } from "@application/dtos/admin/RejectDoctorDTO";
import { BlockUnblockUserResponseDTO } from "@application/dtos/admin/BlockUnblockUserDTO";

export class AdminController {
  constructor(
    private readonly adminLoginUseCase: IAdminLoginUseCase,
    private readonly getAdminDoctorsUseCase: IGetAdminDoctorsUseCase,
    private readonly approveDoctorUseCase: IApproveDoctorUseCase,
    private readonly rejectDoctorUseCase: IRejectDoctorUseCase,
    private readonly blockUnblockUserUseCase: IBlockUnblockUserUseCase,
    private readonly getAllUsersUseCase: IGetAllUsersUseCase
  ) {}

  // Login
  login = catchAsync(async (req: Request, res: Response) => {
    const validated = req.body;

    const result: AdminLoginOutputDTO =
      await this.adminLoginUseCase.execute(validated);

    logger.info("Admin login successful", { email: validated.email });

    res.status(StatusCode.OK).json(result);
  });

  //  Get Doctors 
  getDoctors = catchAsync(async (req: Request, res: Response) => {
    const validated = req.query as any; // safe because middleware parsed

    const result = await this.getAdminDoctorsUseCase.execute(validated);

    logger.info("Admin fetched doctors list", {
      status: validated.status,
      total: result.total,
      page: validated.page,
    });

    res.status(StatusCode.OK).json(result);
  });


approveDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authenticated", StatusCode.UNAUTHORIZED);
  }

  const input = {
    userId: req.body.userId,
    adminId: req.user.id, 
  };

  const result: ApproveRejectDoctorResponseDTO =
    await this.approveDoctorUseCase.execute(input);

  logger.info("Doctor approved", input);

  res.status(StatusCode.OK).json(result);
});
 
  rejectDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authenticated", StatusCode.UNAUTHORIZED);
  }

  const input = {
    userId: req.body.userId,
    reason: req.body.reason,
    adminId: req.user.id,
  };

  const result: RejectDoctorResponseDTO =
    await this.rejectDoctorUseCase.execute(input);

  logger.info("Doctor rejected", input);

  res.status(StatusCode.OK).json(result);
});

blockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authenticated", StatusCode.UNAUTHORIZED);
  }

  const input = {
    userId: req.body.userId,
    adminId: req.user.id, 
  };

  const result: BlockUnblockUserResponseDTO =
    await this.blockUnblockUserUseCase.block(input);

  logger.info("User blocked", input);

  res.status(StatusCode.OK).json(result);
});
 
  unblockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Not authenticated", StatusCode.UNAUTHORIZED);
  }

  const input = {
    userId: req.body.userId,
    adminId: req.user.id, 
  };

  const result: BlockUnblockUserResponseDTO =
    await this.blockUnblockUserUseCase.unblock(input);

  logger.info("User unblocked", input);

  res.status(StatusCode.OK).json(result);
});

  // Get All Users 
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const query = req.query;

    const validated: GetAllUsersDTO = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 6,
      search: query.search as string | undefined,
      role: query.role as string | undefined,
      status: query.status as "ACTIVE" | "BLOCKED" | undefined,
    };

    const result = await this.getAllUsersUseCase.execute(validated);

    logger.info("Fetched users with pagination", {
      count: result.users.length,
      page: result.page,
      limit: result.limit,
      total: result.total,
    });

    res.status(StatusCode.OK).json(result);
  });
}