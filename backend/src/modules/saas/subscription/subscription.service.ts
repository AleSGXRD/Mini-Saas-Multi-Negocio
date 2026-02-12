import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Business, BusinessStatus } from '../business/entities/business.entity';
import mapStripeStatus from '../billing/logic/stripe-status';
import { BillingService } from '../billing/billing.service';
import { Plan } from './entities/plan.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,

    private billingService: BillingService,
  ) {}

  findBusinessSubscription(businessId: string) {
    return this.subscriptionRepository.findOne({
      where: { business: { id: businessId } },
      relations: ['plan'],
    });
  }

  async createSubscription(business: Business, plan: Plan) {
    const subscription = await this.subscriptionRepository.save({
      business,
      plan,
      status: SubscriptionStatus.INCOMPLETE,
    });

    return this.createCheckoutUrl(business.id, subscription.id);
  }

  async createCheckoutUrl(businessid: string, subscriptionId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        id: subscriptionId,
      },
      relations: ['plan'],
    });

    const session = await this.billingService.createCheckout(
      businessid,
      subscription.id,
      subscription.plan.stripePriceId,
    );

    subscription.checkoutSessionId = session.id;
    subscription.checkoutUrl = session.url;
    subscription.checkoutExpiresAt = new Date(session.expires_at * 1000);

    await this.subscriptionRepository.save(subscription);

    return session.url;
  }

  async updateSubscription(
    id: string,
    status: string,
    cancelAtPeriodEnd: boolean,
  ) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { providerSubscriptionId: id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = mapStripeStatus(status);

    subscription.cancelAtPeriodEnd = cancelAtPeriodEnd;

    await this.subscriptionRepository.save(subscription);
  }

  async cancelSubscription(id: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { providerSubscriptionId: id },
      relations: ['business'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.status = SubscriptionStatus.CANCELED;

    subscription.business.status = BusinessStatus.SUSPENDED;

    await this.subscriptionRepository.save(subscription);
    await this.businessRepository.save(subscription.business);
  }
}
