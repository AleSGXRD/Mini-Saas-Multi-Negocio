import { SubscriptionStatus } from '@modules/saas/subscription/entities/subscription.entity';

function mapStripeStatus(status: string) {
  switch (status) {
    case 'active':
      return SubscriptionStatus.ACTIVE;

    case 'past_due':
      return SubscriptionStatus.PAST_DUE;

    case 'unpaid':
      return SubscriptionStatus.UNPAID;

    case 'canceled':
      return SubscriptionStatus.CANCELED;

    default:
      return SubscriptionStatus.INACTIVE;
  }
}

export default mapStripeStatus;
