export class PlatformWallet {
  constructor(
    private readonly id: string,
    private balance: number,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date
  ) {}

  static create(): PlatformWallet {
    return new PlatformWallet(
      "",
      0
    );
  }

  static rehydrate(
    id: string,
    balance: number,
    createdAt?: Date,
    updatedAt?: Date
  ): PlatformWallet {
    return new PlatformWallet(
      id,
      balance,
      createdAt,
      updatedAt
    );
  }

  getId(): string {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  credit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    this.balance += amount;
  }

  debit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (this.balance < amount) {
      throw new Error("Insufficient balance");
    }

    this.balance -= amount;
  }
}