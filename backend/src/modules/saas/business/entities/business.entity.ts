import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Membership } from './membership.entity';
import { Plan } from './plan.entity';

export enum BusinessStatus {
  ACTIVE = 'active',
  PENDING_PAYMENT = 'pending_payment',
  SUSPENDED = 'suspended',
}

@Entity()
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: BusinessStatus,
    default: BusinessStatus.PENDING_PAYMENT,
  })
  status: BusinessStatus;

  @ManyToOne(() => Plan)
  plan: Plan;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Membership, (membership) => membership.business)
  memberships: Membership[];
}
