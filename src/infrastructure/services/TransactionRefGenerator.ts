import { ITransactionRefGenerator }
from "@application/interfaces/services/ITransactionRefGenerator";

import { CounterModel }
from "@infrastructure/persistence/models/CounterModel";

export class TransactionRefGenerator
  implements ITransactionRefGenerator {

  async generate(): Promise<string> {

    const counter =
      await CounterModel.findOneAndUpdate(
        {
          name:
            "wallet_transaction",
        },
        {
          $inc: {
            sequence: 1,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

    const date =
      new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    const sequence =
      String(
        counter.sequence
      ).padStart(6, "0");

    return `TXN-${date}-${sequence}`;
  }
}