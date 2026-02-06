import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { StripeService } from './stripe.service';
import { Subscription } from '../subscription/entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../business/entities/business.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Business, Payment])],
  controllers: [BillingController],
  providers: [BillingService, StripeService],
  exports: [BillingService],
})
export class BillingModule {}
