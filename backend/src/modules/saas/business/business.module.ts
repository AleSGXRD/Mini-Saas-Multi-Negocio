import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Membership } from './entities/membership.entity';
import { AuthModule } from '@modules/auth-clerk/auth/auth.module';
import { Plan } from '../subscription/entities/plan.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, Membership, Plan]),
    AuthModule,
    SubscriptionModule,
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
