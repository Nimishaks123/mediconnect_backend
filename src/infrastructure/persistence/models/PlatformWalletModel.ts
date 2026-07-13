import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IPlatformWalletDocument
  extends Document {

  balance: number;

  createdAt: Date;

  updatedAt: Date;
}

const PlatformWalletSchema =
  new Schema(
    {
      balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export const PlatformWalletModel =
  mongoose.model<IPlatformWalletDocument>(
    "PlatformWallet",
    PlatformWalletSchema
  );