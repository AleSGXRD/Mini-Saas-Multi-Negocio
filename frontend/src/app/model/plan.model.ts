import { PlanCode } from "./enum/plan-code.enum";
import { PlanInterval } from "./enum/plan-interval.enum";

export interface Plan {
  id: number;
  code: PlanCode;
  price: number;
  stripePriceId?: string;
  interval: PlanInterval;
}
