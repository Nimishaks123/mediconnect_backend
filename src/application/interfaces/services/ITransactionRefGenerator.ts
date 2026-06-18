export interface ITransactionRefGenerator {
  generate(): Promise<string>;
}