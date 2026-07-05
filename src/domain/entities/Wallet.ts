import { v4 as uuid } from "uuid";

export class Wallet {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private balance: number
  ) {}

  static create(userId: string): Wallet {
    return new Wallet(
      uuid(),
      userId,
      0
    );
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

  credit(amount: number): void {
    if (amount <= 0) {
      throw new Error(
        "Amount must be positive"
      );
    }

    this.balance += amount;
  }

  debit(amount: number): void {
    if (amount <= 0) {
      throw new Error(
        "Amount must be positive"
      );
    }

    if (this.balance < amount) {
      throw new Error(
        "Insufficient balance"
      );
    }

    this.balance -= amount;
  }
}