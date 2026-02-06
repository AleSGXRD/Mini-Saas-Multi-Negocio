import { Subscription } from '@modules/saas/subscription/entities/subscription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subscription, (s) => s.invoices)
  subscription: Subscription;

  @Column({ unique: true })
  providerInvoiceId: string;

  @Column()
  amountDue: number;

  @Column()
  amountPaid: number;

  @Column()
  currency: string;

  @Column()
  status: 'pending' | 'paid' | 'failed';

  @Column()
  hostedInvoiceUrl: string;

  @Column()
  pdfUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
