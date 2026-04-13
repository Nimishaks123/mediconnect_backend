import { Request } from "express";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { AdminLoginDTO } from "@application/dtos/admin/AdminLoginDTO";
import { ApproveRejectDoctorDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { BlockUnblockUserDTO } from "@application/dtos/admin/BlockUnblockUserDTO";
import { RejectDoctorDTO } from "@application/dtos/admin/RejectDoctorDTO";
import { GetAllUsersDTO } from "@application/dtos/admin/GetAllUsersDTO";
import { GetAdminAppointmentsDTO } from "@application/dtos/admin/AdminAppointmentDTO";

export class AdminMapper {
  static toLoginDTO(req: Request): AdminLoginDTO {
    return {
      email: req.body.email,
      password: req.body.password,
    };
  }

  static toApproveDoctorDTO(req: AuthenticatedRequest): ApproveRejectDoctorDTO {
    return {
      userId: req.body.userId,
      adminId: req.user?.id,
    };
  }

  static toRejectDoctorDTO(req: AuthenticatedRequest): RejectDoctorDTO {
    return {
      userId: req.body.userId,
      reason: req.body.reason,
      adminId: req.user?.id,
    };
  }

  static toBlockUnblockDTO(req: AuthenticatedRequest): BlockUnblockUserDTO {
    return {
      userId: req.body.userId,
      adminId: req.user?.id,
    };
  }

  static toGetAllUsersDTO(req: Request): GetAllUsersDTO {
    return {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 6,
      search: (req.query.search as string) || "",
      role: req.query.role as string | undefined,
      status: req.query.status as "ACTIVE" | "BLOCKED" | undefined,
    };
  }

  static toGetAdminAppointmentsDTO(req: Request): GetAdminAppointmentsDTO {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const type = (req.query.type as any) || "UPCOMING";
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const sortRaw = req.query.sort as string | undefined;
    
    const sort: "LATEST" | "OLDEST" = sortRaw === "OLDEST" ? "OLDEST" : "LATEST";

    // Basic enum validation
    const validTypes = ["UPCOMING", "PAST", "RECENT"];
    const finalType = (validTypes.includes(type) ? type : "UPCOMING") as "UPCOMING" | "PAST" | "RECENT";

    return { 
      page, 
      limit, 
      type: finalType,
      status: status || undefined,
      search: search || undefined,
      sort
    };
  }
}
