import { IWalletQueryRepository } from "@application/interfaces/queries/IWalletQueryRepository";
import { WalletModel } from "../persistence/models/WalletModel";
import { WalletTransactionModel } from "../persistence/models/WalletTransactionModel";
import { 
  AdminWalletListItemDTO, 
  AdminTransactionListItemDTO 
} from "@application/dtos/admin/AdminWalletDTO";
import mongoose from "mongoose";

export class WalletQueryRepository implements IWalletQueryRepository {
  async findAdminWallets(
    page: number,
    limit: number,
    search?: string,
    sort?: "NEWEST" | "OLDEST"
  ): Promise<{ data: AdminWalletListItemDTO[]; total: number }> {
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    pipeline.push({
      $project: {
        userId: { $toString: "$userId" },
        name: "$user.name",
        email: "$user.email",
        balance: 1,
        totalCredits: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$transactions",
                  as: "tx",
                  cond: { $eq: ["$$tx.type", "CREDIT"] }
                }
              },
              as: "tx",
              in: "$$tx.amount"
            }
          }
        },
        totalDebits: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$transactions",
                  as: "tx",
                  cond: { $eq: ["$$tx.type", "DEBIT"] }
                }
              },
              as: "tx",
              in: "$$tx.amount"
            }
          }
        },
        createdAt: 1
      }
    });

    // Sort logic,default to NEWEST 
    const sortOrder = sort === "OLDEST" ? 1 : -1;
    pipeline.push({ $sort: { createdAt: sortOrder } });

    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const [data, countResult] = await Promise.all([
      WalletModel.aggregate(pipeline),
      WalletModel.aggregate(countPipeline)
    ]);

    return {
      data,
      total: countResult[0]?.total || 0
    };
  }

async findAdminWalletTransactions(
  userId: string,
  page: number,
  limit: number,
  type?: "CREDIT" | "DEBIT",
  search?: string,
  sort?: "NEWEST" | "OLDEST"
): Promise<{
  data: AdminTransactionListItemDTO[];
  total: number;
  balance: number;
  userName: string;
  userEmail: string;
}> {

  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      data: [],
      total: 0,
      balance: 0,
      userName: "",
      userEmail: "",
    };
  }

  const userObjectId =
    new mongoose.Types.ObjectId(userId);

  const wallet =
    await WalletModel
      .findOne({
        userId: userObjectId,
      })
      .populate(
        "userId",
        "name email"
      );

  if (!wallet) {
    return {
      data: [],
      total: 0,
      balance: 0,
      userName: "",
      userEmail: "",
    };
  }

  const userData = wallet.userId as any;

  const filter: any = {
    walletId: wallet._id,
  };

  if (type) {
    filter.type = type;
  }

  if (search) {
    filter.description = {
      $regex: search,
      $options: "i",
    };
  }

  const total =
    await WalletTransactionModel
      .countDocuments(filter);

  // const sortOption =
  //   sort === "OLDEST"
  //     ? { createdAt: 1 }
  //     : { createdAt: -1 };

  // const transactions =
  //   await WalletTransactionModel
  //     .find(filter)
  //     .sort(sortOption)
  //     .skip(skip)
  //     .limit(limit);
  const transactions =
  await WalletTransactionModel
    .find(filter)
    .sort({
      createdAt:
        sort === "OLDEST"
          ? 1
          : -1,
    })
    .skip(skip)
    .limit(limit);

  const paginatedData =
    transactions.map((transaction) => ({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      createdAt:
        transaction.createdAt.toISOString(),
    }));

  return {
    data: paginatedData,
    total,
    balance: wallet.balance,
    userName: userData?.name ?? "",
    userEmail: userData?.email ?? "",
  };
}
}
