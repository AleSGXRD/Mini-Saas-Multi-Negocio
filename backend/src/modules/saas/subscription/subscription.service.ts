import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Business, BusinessStatus } from '../business/entities/business.entity';
import mapStripeStatus from '../billing/logic/stripe-status';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

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
