import { IPlatformWalletRepository }
from "@domain/interfaces/IPlatformWalletRepository";

import { IPlatformWalletTransactionRepository }
from "@domain/interfaces/IPlatformWalletTransactionRepository";

export interface GetPlatformWalletTransactionsDTO {
  page: number;
  limit: number;
}

export interface PlatformWalletTransactionResponseDTO {
  transactionRef: string;
  appointmentId: string;
  amount: number;
  description: string;
  type: string;
  source: string;
  createdAt: Date;
}

export interface GetPlatformWalletTransactionsResponseDTO {
  transactions: PlatformWalletTransactionResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetPlatformWalletTransactionsUseCase {

  constructor(
    private readonly walletRepo:
      IPlatformWalletRepository,

    private readonly transactionRepo:
      IPlatformWalletTransactionRepository
  ) {}

  async execute(
    dto: GetPlatformWalletTransactionsDTO
  ): Promise<GetPlatformWalletTransactionsResponseDTO> {

    const wallet =
      await this.walletRepo.find();

    if (!wallet) {
      return {
        transactions: [],
        total: 0,
        page: dto.page,
        limit: dto.limit,
        totalPages: 0,
      };
    }

    const {
      transactions,
      total,
    } =
      await this.transactionRepo.findByWalletId(
        wallet.getId(),
        dto.page,
        dto.limit
      );

    return {

      transactions:
        transactions.map((transaction) => ({
          transactionRef:
            transaction.getTransactionRef(),

          appointmentId:
            transaction.getAppointmentId(),

          amount:
            transaction.getAmount(),

          description:
            transaction.getDescription(),

          type:
            transaction.getType(),

          source:
            transaction.getSource(),

          createdAt:
            transaction.getCreatedAt(),
        })),

      total,

      page:
        dto.page,

      limit:
        dto.limit,

      totalPages:
        Math.ceil(total / dto.limit),
    };
  }
}