import { Controller, Post, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Public } from '@modules/auth-clerk/decorators/public.decorator';
import { StripeService } from '../stripe/stripe.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
  ) {}

  @Public()
  @Post('webhook')
  async webhook(@Req() req: any) {
    const stripe = this.stripeService.client;

    const sig = req.headers['stripe-signature'];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!,
    );

    const objectStripe: any = event.data.object;

    switch (event.type) {
      case 'customer.subscription.updated': {
        const { id, status, cancel_at_period_end } = objectStripe;

        await this.subscriptionService.updateSubscription(
          id,
          status,
          cancel_at_period_end,
        );

        break;
      }

      case 'customer.subscription.deleted': {
        const { id } = objectStripe;

        await this.subscriptionService.cancelSubscription(id);

        break;
      }
    }

    return { received: true };
  }
}
