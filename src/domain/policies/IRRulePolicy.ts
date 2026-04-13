export interface IRRulePolicy {
  validate(rule: string): void;

  generateDates(
    rule: string,
    from: Date,
    to: Date,
    dtStart?: Date
  ): Date[];
}
