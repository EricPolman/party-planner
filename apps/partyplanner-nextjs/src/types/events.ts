import { Invitation } from "@clerk/nextjs/server";

export interface PlannerEventListItem {
  id: string;
  title: string;
  description: string;
}

export interface PlannerEvent extends PlannerEventListItem {
  invitations: Array<Invitation>;
}
