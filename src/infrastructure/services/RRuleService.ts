import { InvalidDoctorScheduleError } from "@domain/errors/InvalidDoctorScheduleError";
import { RRulePolicy } from "@domain/policies/RRulePolicy";
import { RRule } from "rrule";

export class RRuleService implements RRulePolicy{
  validate(rule: string): void {
    try{
      RRule.fromString(rule);

    }catch{
      throw new InvalidDoctorScheduleError("Invalid recurrence rule");
    }
    
  }
  generateDates(rule: string, from: Date, to: Date): Date[] {
    const rrule=RRule.fromString(rule);
    return rrule.between(from,to,true);
  }
}
