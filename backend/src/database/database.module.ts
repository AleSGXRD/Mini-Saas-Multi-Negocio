import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from '@modules/saas/subscription/entities/plan.entity';
import { PlanSeeder } from './seeders/plan.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  providers: [PlanSeeder],
})
export class DatabaseModule {}
