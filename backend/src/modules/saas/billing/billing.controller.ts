import { Controller, Post, Param, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscription/entities/subscription.entity';
import { Repository } from 'typeorm';
import { Business, BusinessStatus } from '../business/entities/business.entity';
import { Public } from '@modules/auth-clerk/decorators/public.decorator';

@Controller('billing')
export class BillingController {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,

    private readonly billingService: BillingService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('checkout/:subscriptionId')
  async checkout(@Param('subscriptionId') subscriptionId: string) {
    const subscription =
      await this.billingService.findSubscriptionById(subscriptionId);
    return {
      url: await this.billingService.createCheckout(
        subscription.business.id,
        subscription.id,
        subscription.plan.price,
      ),
    };
  }

  @Public()
  @Post('webhook')
  async webhook(@Req() req: any) {
    console.log('webhook posted');
    const stripe = this.stripeService.client;

    const sig = req.headers['stripe-signature'];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === 'checkout.session.completed') {
      const session: any = event.data.object;

      const subscriptionId = session.metadata.subscriptionId;

      const subscription = await this.subscriptionRepo.findOne({
        where: { id: subscriptionId },
        relations: ['business'],
      });

      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.business.status = BusinessStatus.ACTIVE;

      await this.subscriptionRepo.save(subscription);
      await this.businessRepo.save(subscription.business);
    }

    return { received: true };
  }
}
