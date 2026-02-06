import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PlanCode {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum PlanInterval {
  MONTH = 'month',
  YEAR = 'year',
}

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PlanCode, unique: true })
  code: PlanCode;

  @Column()
  price: number;

  @Column({ nullable: true })
  stripePriceId: string;

  @Column({ type: 'enum', enum: PlanInterval, default: PlanInterval.MONTH })
  interval: PlanInterval;
}
