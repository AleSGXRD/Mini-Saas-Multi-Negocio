import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Subscription } from '../subscription/entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../business/entities/business.entity';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Business, Invoice, Payment]),
  ],
  controllers: [BillingController],
  providers: [BillingService, StripeService],
  exports: [BillingService, StripeService],
})
export class BillingModule {}
