import { Membership } from '@modules/saas/business/entities/membership.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clerkId: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];
}
