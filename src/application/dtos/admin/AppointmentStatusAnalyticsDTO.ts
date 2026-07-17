import { AppointmentStatus } from "@domain/enums/AppointmentStatus";

export type AppointmentStatusAnalyticsDTO = {
  status: AppointmentStatus;
  count: number;
}[];
