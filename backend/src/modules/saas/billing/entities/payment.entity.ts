import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice)
  invoice: Invoice;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column({ unique: true })
  providerPaymentId: string;

  @CreateDateColumn()
  createdAt: Date;
}
