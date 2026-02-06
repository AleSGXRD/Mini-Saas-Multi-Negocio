import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Plan } from './plan.entity';
import { Payment } from '../../billing/entities/payment.entity';

export enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  ACTIVE = 'active',
  CANCELED = 'canceled',
}

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business)
  business: Business;

  @ManyToOne(() => Plan)
  plan: Plan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  @Column({ nullable: true })
  providerSubscriptionId: string; // stripe/paypal id

  @OneToMany(() => Payment, (p) => p.subscription)
  payments: Payment[];
}
