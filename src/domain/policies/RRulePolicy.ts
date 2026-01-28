export interface RRulePolicy {
  validate(rule: string): void;
  generateDates(rule: string, from: Date, to: Date): Date[];
}
