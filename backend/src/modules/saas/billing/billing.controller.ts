import { Controller, Post, Param, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';
import { Public } from '@modules/auth-clerk/decorators/public.decorator';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('checkout/:subscriptionId')
  async checkout(@Param('subscriptionId') subscriptionId: string) {
    const subscription =
      await this.billingService.findSubscriptionById(subscriptionId);
    return {
      url: await this.billingService.createCheckout(
        subscription.business,
        subscription.plan,
      ),
    };
  }

  @Public()
  @Post('webhook')
  async webhook(@Req() req: any) {
    const stripe = this.stripeService.client;

    const sig = req.headers['stripe-signature'];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    const objectStripe: any = event.data.object;

    const subscriptionId = objectStripe.metadata.subscriptionId;
    switch (event.type) {
      case 'invoice.paid': {
        await this.billingService.paymentSuccess(subscriptionId, objectStripe);

        break;
      }

      case 'invoice.payment_failed': {
        await this.billingService.paymentFailed(subscriptionId, objectStripe);

        break;
      }

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
