import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './business.entity';
import { User } from 'src/modules/auth-clerk/auth/entities/auth.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @ManyToOne(() => Business, (business) => business.memberships, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @Column()
  role: 'owner' | 'admin' | 'member';
}
