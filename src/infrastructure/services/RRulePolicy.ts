import { RRule } from "rrule";
import { IRRulePolicy } from "../../domain/policies/IRRulePolicy";

export class RRulePolicy implements IRRulePolicy {

  validate(rule: string): void {
    try {
      RRule.fromString(rule);
    } catch {
      throw new Error("Invalid RRULE format");
    }
  }

  generateDates(
    rule: string,
    from: Date,
    to: Date,
    dtStart?: Date
  ): Date[] {
    const finalRule = dtStart
      ? `${rule};DTSTART=${this.formatDate(dtStart)}`
      : rule;

    const rrule = RRule.fromString(finalRule);

    return rrule.between(from, to, true);
  }

  private formatDate(date: Date): string {
    // RRULE requires UTC format
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";
  }
}
