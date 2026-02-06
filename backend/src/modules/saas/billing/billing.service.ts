import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../subscription/entities/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BillingService {
  constructor(
    private stripeService: StripeService,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async findSubscriptionById(subscriptionId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['business', 'plan'],
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  async createCheckout(
    businessId: string,
    subscriptionId: string,
    stripePriceId: string,
  ) {
    const stripe = this.stripeService.client;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // luego puedes usar subscription
      payment_method_types: ['card', 'pix', 'paypal'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,

      metadata: {
        businessId,
        subscriptionId,
      },
    });

    return session.url;
  }
}
