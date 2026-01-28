import { Request, Response, NextFunction } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { GetAllUsersDTO } from "@application/dtos/admin/GetAllUsersDTO";
import { IAdminLoginUseCase } from "@application/interfaces/admin/IAdminLoginUseCase";
import { IGetPendingDoctorsUseCase } from "@application/interfaces/admin/IGetPendingDoctorsUseCase";
import { IApproveDoctorUseCase } from "@application/interfaces/admin/IApproveDoctorUseCase";
import { IRejectDoctorUseCase } from "@application/interfaces/admin/IRejectDoctorUseCase";
import { IBlockUnblockUserUseCase } from "@application/interfaces/admin/IBlockUnblockUserUseCase";
import { IGetAllUsersUseCase } from "@application/interfaces/admin/IGetAllUsersUseCase";

import {
  AdminLoginDTO,
  AdminLoginOutputDTO,
} from "@application/dtos/admin/AdminLoginDTO";
import {
  ApproveRejectDoctorDTO,
  ApproveRejectDoctorResponseDTO,
} from "@application/dtos/admin/ApproveRejectDoctorDTO";
import {
  BlockUnblockUserDTO,
  BlockUnblockUserResponseDTO,
} from "@application/dtos/admin/BlockUnblockUserDTO";
import {
  GetPendingDoctorsOutputDTO,
} from "@application/dtos/admin/GetPendingDoctorsOutputDTO";

export class AdminController {
  constructor(
    private readonly adminLoginUseCase: IAdminLoginUseCase,
    private readonly getPendingDoctorsUseCase: IGetPendingDoctorsUseCase,
    private readonly approveDoctorUseCase: IApproveDoctorUseCase,
    private readonly rejectDoctorUseCase: IRejectDoctorUseCase,
    private readonly blockUnblockUserUseCase: IBlockUnblockUserUseCase,
    private readonly getAllUsersUseCase: IGetAllUsersUseCase
  ) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: AdminLoginDTO = {
        email: req.body.email,
        password: req.body.password,
      };

      const result: AdminLoginOutputDTO =
        await this.adminLoginUseCase.execute(dto);

      logger.info("Admin login successful", { email: dto.email });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Admin login failed");
      next(error);
    }
  };
  getPendingDoctors = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result: GetPendingDoctorsOutputDTO =
        await this.getPendingDoctorsUseCase.execute();

      logger.info("Fetched pending doctors", { count: result.count });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Failed to fetch pending doctors");
      next(error);
    }
  };
approveDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const adminId = (req as any).user?.id;

      const dto: ApproveRejectDoctorDTO = {
        userId: req.body.userId,
        adminId,
      };

      const result: ApproveRejectDoctorResponseDTO =
        await this.approveDoctorUseCase.execute(dto);

      logger.info("Doctor approved", {
        userId: dto.userId,
        adminId,
      });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Approve doctor failed");
      next(error);
    }
  };

  rejectDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const adminId = (req as any).user?.id;

      const dto: ApproveRejectDoctorDTO = {
        userId: req.body.userId,
        reason: req.body.reason,
        adminId,
      };

      const result: ApproveRejectDoctorResponseDTO =
        await this.rejectDoctorUseCase.execute(dto);

      logger.info("Doctor rejected", {
        userId: dto.userId,
        adminId,
      });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Reject doctor failed");
      next(error);
    }
  };

  blockUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const adminId = (req as any).user?.id;

      const dto: BlockUnblockUserDTO = {
        userId: req.body.userId,
        adminId,
      };

      const result: BlockUnblockUserResponseDTO =
        await this.blockUnblockUserUseCase.block(dto);

      logger.info("User blocked", { userId: dto.userId, adminId });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Block user failed");
      next(error);
    }
  };

  unblockUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const adminId = (req as any).user?.id;

      const dto: BlockUnblockUserDTO = {
        userId: req.body.userId,
        adminId,
      };

      const result: BlockUnblockUserResponseDTO =
        await this.blockUnblockUserUseCase.unblock(dto);

      logger.info("User unblocked", { userId: dto.userId, adminId });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Unblock user failed");
      next(error);
    }
  };
getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
     res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = (req.query.search as string) || "";
const role = req.query.role as string | undefined;
const status = req.query.status as "ACTIVE" | "BLOCKED" | undefined;

   const dto: GetAllUsersDTO = {
  page,
  limit,
  search,
  role,
  status,
};

    const result = await this.getAllUsersUseCase.execute(dto);

    logger.info("Fetched users with pagination", {
      count: result.users.length,
      page: result.page,
      limit: result.limit,
      total: result.total,
    });

    res.status(StatusCode.OK).json(result);
  } catch (error) {
    logger.error("Get all users failed");
    next(error);
  }
};
}
