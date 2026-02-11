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

    const checkoutUrl = await this.billingService.createCheckout(
      business.id,
      subscription.id,
      plan.stripePriceId,
    );

    subscription.checkoutUrl = checkoutUrl;

    await this.subscriptionRepository.save(subscription);

    return checkoutUrl;
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
