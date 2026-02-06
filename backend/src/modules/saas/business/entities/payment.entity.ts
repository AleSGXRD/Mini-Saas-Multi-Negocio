import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from '../../subscription/entities/subscription.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subscription)
  subscription: Subscription;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  providerPaymentId: string;

  @Column()
  status: 'pending' | 'paid' | 'failed';
}
