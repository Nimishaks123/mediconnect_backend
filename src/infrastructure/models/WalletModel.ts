import mongoose, { Schema, Document } from "mongoose";

export interface IWalletDocument extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  transactions: {
    type: "CREDIT" | "DEBIT";
    amount: number;
    description: string;
    createdAt: Date;
  }[];
}

const WalletSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0, min: 0 },
    transactions: [
      {
        type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const WalletModel = mongoose.model<IWalletDocument>("Wallet", WalletSchema);
