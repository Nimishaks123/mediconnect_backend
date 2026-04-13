import { IAdminDoctorQueryRepository } from "../../application/interfaces/admin/IAdminDoctorQueryRepository";
import { AdminDoctorListResponseDTO } from "../../application/dtos/admin/AdminDoctorListDTO";
import { DoctorModel } from "./models/DoctorModel";

export class AdminDoctorQueryRepository implements IAdminDoctorQueryRepository {
  async getAdminDoctors(
    status: string,
    page: number, 
    limit: number, 
    search?: string, 
    sort?: "NEWEST" | "OLDEST"
  ): Promise<AdminDoctorListResponseDTO> {
    const skip = (page - 1) * limit;
    
    // Base match for the requested status
    const baseMatch = { verificationStatus: status };
    
    // Build aggregation pipeline
    const pipeline: any[] = [
      { $match: baseMatch },
      {
        $lookup: {
          from: "users", 
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" }
    ];

    // Search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "userDetails.name": { $regex: search, $options: "i" } },
            { "userDetails.email": { $regex: search, $options: "i" } },
            { "registrationNumber": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    // Sort: Default to NEWEST
    const sortOrder = sort === "OLDEST" ? 1 : -1;
    pipeline.push({ $sort: { createdAt: sortOrder } });

    // Count before pagination
    const countPipeline = [...pipeline, { $count: "total" }];
    
    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const [doctorsRaw, countResult] = await Promise.all([
      DoctorModel.aggregate(pipeline),
      DoctorModel.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    const doctors = doctorsRaw.map((doc) => ({
      doctor: {
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        specialty: doc.specialty,
        qualification: doc.qualification,
        experience: doc.experience,
        consultationFee: doc.consultationFee,
        registrationNumber: doc.registrationNumber,
        licenseDocument: doc.licenseDocument ?? null,
        certifications: doc.certifications ?? [],
        aboutMe: doc.aboutMe ?? "",
        profilePhoto: doc.profilePhoto ?? null,
        onboardingStatus: doc.onboardingStatus,
        verificationStatus: doc.verificationStatus,
        verifiedBy: doc.verifiedBy ? doc.verifiedBy.toString() : null,
        verifiedAt: doc.verifiedAt ?? null,
        rejectionReason: doc.rejectionReason ?? null,
        createdAt: doc.createdAt
      },
      user: {
        id: doc.userDetails._id.toString(),
        name: doc.userDetails.name,
        email: doc.userDetails.email,
        role: doc.userDetails.role,
        blocked: doc.userDetails.blocked,
        isVerified: doc.userDetails.isVerified,
      },
    }));

    return {
      total,
      doctors,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      }
    };
  }
}
