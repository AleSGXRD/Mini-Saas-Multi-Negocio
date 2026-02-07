import { BusinessStatus } from "./enum/business-status.enum";
import { Plan } from "./plan.model";

export interface Business{
  id: string;
  name: string;
  status: BusinessStatus;
  active: boolean;
  createdAt: Date;
  plan: Plan;
  // memberships: Membership[];
}
