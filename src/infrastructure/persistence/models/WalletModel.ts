import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IWalletDocument
  extends Document {

  userId:
    mongoose.Types.ObjectId;

  balance: number;
}

const WalletSchema =
  new Schema(
    {
      userId: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,
      },

      balance: {
        type: Number,

        default: 0,

        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export const WalletModel =
  mongoose.model<IWalletDocument>(
    "Wallet",
    WalletSchema
  );