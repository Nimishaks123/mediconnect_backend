import { ActivityType } from "@domain/enums/ActivityType";

export interface RecentActivityItemDTO {
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
}

export type RecentActivityDTO = RecentActivityItemDTO[];
