import {v4 as uuid} from "uuid";
import { TransactionType } from "@domain/enums/TransactionType";
import { TransactionSource } from "@domain/enums/TransactionSource";
import { TransactionStatus } from "@domain/enums/TransactionStatus";
export class WalletTransaction{
    constructor(
        private readonly id:string,
        private readonly transactionRef:string,
        private readonly walletId:string,
        private readonly amount:number,
        private readonly description:string,
        private readonly type:TransactionType,
        private readonly source:TransactionSource,
        private status:TransactionStatus,
        private readonly stripeSessionId:string|null,
        private readonly createdAt:Date
        
    ){}
    static create(params: {
    transactionRef: string;

    walletId: string;

    amount: number;
     description:string;

    type: TransactionType;

    source: TransactionSource;

    stripeSessionId?: string;
  }) {

    return new WalletTransaction(
      uuid(),

      params.transactionRef,

      params.walletId,

      params.amount,
      params.description,

      params.type,

      params.source,

      TransactionStatus.PENDING,

      params.stripeSessionId ??
      null,

      new Date()
    );
  }

  static rehydrate(props: {
    id: string;

    transactionRef: string;

    walletId: string;

    amount: number;
    description:string;

    type: TransactionType;

    source: TransactionSource;

    status: TransactionStatus;

    stripeSessionId?: string | null;

    createdAt: Date;
  }) {

    return new WalletTransaction(
      props.id,

      props.transactionRef,

      props.walletId,

      props.amount,
      props.description,

      props.type,

      props.source,

      props.status,

      props.stripeSessionId ??
      null,

      props.createdAt
    );
  }

  markSuccess() {
    this.status =
      TransactionStatus.SUCCESS;
  }

  markFailed() {
    this.status =
      TransactionStatus.FAILED;
  }
  isSuccess(): boolean {
  return this.status ===
    TransactionStatus.SUCCESS;
}
isPending(): boolean {
  return this.status ===
    TransactionStatus.PENDING;
}

  getId() {
    return this.id;
  }

  getWalletId() {
    return this.walletId;
  }

  getTransactionRef() {
    return this.transactionRef;
  }

  getAmount() {
    return this.amount;
  }
  getDescription(){
    return this.description;
}

  getType() {
    return this.type;
  }

  getSource() {
    return this.source;
  }

  getStatus() {
    return this.status;
  }

  getStripeSessionId() {
    return this.stripeSessionId;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
