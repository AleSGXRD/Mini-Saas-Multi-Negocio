import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Plan } from './plan.entity';
import { Invoice } from '@modules/saas/billing/entities/invoice.entity';

export enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  INACTIVE = 'inactive',
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
  providerSubscriptionId: string;

  @Column({ nullable: true })
  checkoutUrl?: string;

  @Column({ default: false })
  cancelAtPeriodEnd: boolean;

  @OneToMany(() => Invoice, (i) => i.subscription)
  invoices: Invoice[];
}
