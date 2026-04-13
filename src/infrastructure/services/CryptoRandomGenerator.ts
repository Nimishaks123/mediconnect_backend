import crypto from "crypto";
import { IRandomGenerator } from "@application/interfaces/services/IRandomGenerator";

export class CryptoRandomGenerator implements IRandomGenerator {
  generate(length: number = 16): string {
    return crypto.randomBytes(length).toString("hex");
  }
}
