import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";

export class WalletMapper {
  static toGetUserWalletDTO(req: AuthenticatedRequest): string {
    return req.user!.id;
  }

  // Future methods can be added here
  static toCreditWalletDTO(req: AuthenticatedRequest): { userId: string; amount: number; description: string } {
    return {
      userId: req.user!.id,
      amount: Number(req.body.amount),
      description: req.body.description,
    };
  }
}
