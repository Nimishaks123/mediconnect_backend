import { PlatformTransactionSource } from "@domain/enums/PlatformTransactionSource";
import { PlatformTransactionType } from "@domain/enums/PlatformTransactionType";
export class PlatformWalletTransaction {
  constructor(
    private readonly id: string,
    private readonly transactionRef: string,
    private readonly walletId: string,
    private readonly appointmentId: string,
    private readonly amount: number,
    private readonly description: string,
    private readonly type: PlatformTransactionType,
    private readonly source: PlatformTransactionSource,
    private readonly createdAt: Date
  ) {}

  static create(params: {
    transactionRef: string;
    walletId: string;
    appointmentId: string;
    amount: number;
    description: string;
    type: PlatformTransactionType;
    source: PlatformTransactionSource;
  }): PlatformWalletTransaction {
    return new PlatformWalletTransaction(
      "",
      params.transactionRef,
      params.walletId,
      params.appointmentId,
      params.amount,
      params.description,
      params.type,
      params.source,
      new Date()
    );
  }

  static rehydrate(props: {
    id: string;
    transactionRef: string;
    walletId: string;
    appointmentId: string;
    amount: number;
    description: string;
    type: PlatformTransactionType;
    source: PlatformTransactionSource;
    createdAt: Date;
  }): PlatformWalletTransaction {
    return new PlatformWalletTransaction(
      props.id,
      props.transactionRef,
      props.walletId,
      props.appointmentId,
      props.amount,
      props.description,
      props.type,
      props.source,
      props.createdAt
    );
  }

  getId() {
    return this.id;
  }

  getTransactionRef() {
    return this.transactionRef;
  }

  getWalletId() {
    return this.walletId;
  }

  getAppointmentId() {
    return this.appointmentId;
  }

  getAmount() {
    return this.amount;
  }

  getDescription() {
    return this.description;
  }

  getType() {
    return this.type;
  }

  getSource() {
    return this.source;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}