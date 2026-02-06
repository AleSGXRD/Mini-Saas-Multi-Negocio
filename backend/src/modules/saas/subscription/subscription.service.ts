import { Injectable } from '@nestjs/common';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../business/entities/business.entity';
import { Plan } from '../business/entities/plan.entity';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class SubscriptionService {
  /**
   *
   */
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,

    private billingService: BillingService,
  ) {}

  async createCheckout(business: Business, plan: Plan) {
    const subscription = await this.subscriptionRepository.save({
      business,
      plan,
      status: SubscriptionStatus.INCOMPLETE,
    });

    const checkoutUrl = await this.billingService.createCheckout(
      business.id,
      subscription.id,
      plan.price,
    );

    return checkoutUrl;
  }
}
