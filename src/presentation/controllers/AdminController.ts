import { Request, Response} from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { AdminMapper } from "../mappers/AdminMapper";

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
import { AdminDoctorListResponseDTO } from "@application/dtos/admin/AdminDoctorListDTO";

export class AdminController {
  constructor(
    private readonly adminLoginUseCase: IAdminLoginUseCase,
    private readonly getAdminDoctorsUseCase: IGetAdminDoctorsUseCase,
    private readonly approveDoctorUseCase: IApproveDoctorUseCase,
    private readonly rejectDoctorUseCase: IRejectDoctorUseCase,
    private readonly blockUnblockUserUseCase: IBlockUnblockUserUseCase,
    private readonly getAllUsersUseCase: IGetAllUsersUseCase
  ) {}

  login = catchAsync(async (req: Request, res: Response) => {
    const dto = AdminMapper.toLoginDTO(req);
    const result: AdminLoginOutputDTO = await this.adminLoginUseCase.execute(dto);

    logger.info("Admin login successful", { email: dto.email });
    res.status(StatusCode.OK).json(result);
  });

  getDoctors = catchAsync(async (req: Request, res: Response) => {
    const status = (req.query.status as any) || "PENDING";
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search = req.query.search as string | undefined;
    const sort = (req.query.sort as "NEWEST" | "OLDEST") || "NEWEST";

    const result = await this.getAdminDoctorsUseCase.execute({
      status,
      page,
      limit,
      search,
      sort
    });

    logger.info("Admin fetched doctors list", { status, total: result.total, page });
    res.status(StatusCode.OK).json(result);
  });

  approveDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const dto = AdminMapper.toApproveDoctorDTO(req);
    const result: ApproveRejectDoctorResponseDTO = await this.approveDoctorUseCase.execute(dto);

    logger.info("Doctor approved", { userId: dto.userId, adminId: dto.adminId });
    res.status(StatusCode.OK).json(result);
  });

  rejectDoctor = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const dto = AdminMapper.toRejectDoctorDTO(req);
    const result: RejectDoctorResponseDTO = await this.rejectDoctorUseCase.execute(dto);

    logger.info("Doctor rejected", { userId: dto.userId, adminId: dto.adminId });
    res.status(StatusCode.OK).json(result);
  });

  blockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const dto = AdminMapper.toBlockUnblockDTO(req);
    const result: BlockUnblockUserResponseDTO = await this.blockUnblockUserUseCase.block(dto);

    logger.info("User blocked", { userId: dto.userId, adminId: dto.adminId });
    res.status(StatusCode.OK).json(result);
  });

  unblockUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const dto = AdminMapper.toBlockUnblockDTO(req);
    const result: BlockUnblockUserResponseDTO = await this.blockUnblockUserUseCase.unblock(dto);

    logger.info("User unblocked", { userId: dto.userId, adminId: dto.adminId });
    res.status(StatusCode.OK).json(result);
  });

  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const dto = AdminMapper.toGetAllUsersDTO(req);
    const result = await this.getAllUsersUseCase.execute(dto);

    logger.info("Fetched users with pagination", {
      count: result.users.length,
      page: result.page,
      limit: result.limit,
      total: result.total,
    });

    res.status(StatusCode.OK).json(result);
  });
}
