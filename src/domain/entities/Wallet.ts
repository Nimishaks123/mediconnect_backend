import { v4 as uuid } from "uuid";

export interface WalletTransaction {
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  createdAt: Date;
}

export class Wallet {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private balance: number,
    private transactions: WalletTransaction[] = []
  ) {}

  /**
   * Static Factory Method 
   */
  static create(userId: string): Wallet {
    return new Wallet(uuid(), userId, 0, []);
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getBalance(): number {
    return this.balance;
  }

  getTransactions(): WalletTransaction[] {
    return [...this.transactions];
  }

  credit(amount: number, description: string) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.balance += amount;
    this.transactions.push({
      type: "CREDIT",
      amount,
      description,
      createdAt: new Date(),
    });
  }

  debit(amount: number, description: string) {
    if (amount <= 0) throw new Error("Amount must be positive");
    if (this.balance < amount) throw new Error("Insufficient balance");
    this.balance -= amount;
    this.transactions.push({
      type: "DEBIT",
      amount,
      description,
      createdAt: new Date(),
    });
  }
}
