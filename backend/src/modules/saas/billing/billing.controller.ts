import { Controller, Post, Param, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Public } from '@modules/auth-clerk/decorators/public.decorator';
import { StripeService } from '../stripe/stripe.service';

@Controller('billing')
export class BillingController {
  constructor(
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
        subscription.plan.stripePriceId,
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
    }

    return { received: true };
  }
}
