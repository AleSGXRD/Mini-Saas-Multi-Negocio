import { Module } from '@nestjs/common';
import { BusinessModule } from './business/business.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { BillingModule } from './billing/billing.module';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [BusinessModule, SubscriptionModule, BillingModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class SaasModule {}
