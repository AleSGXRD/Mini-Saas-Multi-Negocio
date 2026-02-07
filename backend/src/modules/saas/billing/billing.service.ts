import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscription/entities/subscription.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { Business } from '../business/entities/business.entity';
import { Plan } from '../subscription/entities/plan.entity';

@Injectable()
export class BillingService {
  constructor(
    private stripeService: StripeService,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
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

  async createCheckout(business: Business, plan: Plan) {
    const subscription = await this.subscriptionRepository.save({
      business,
      plan,
      status: SubscriptionStatus.INCOMPLETE,
    });
    const { stripePriceId } = plan;
    const { id: subscriptionId } = subscription;
    const { id: businessId } = business;

    const stripe = this.stripeService.client;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // luego puedes usar subscription
      payment_method_types: ['card'],
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

  async paymentSuccess(subscriptionId: string, invoiceStripe: any) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    let invoice = await this.invoiceRepository.findOne({
      where: { providerInvoiceId: invoiceStripe.id },
    });
    if (!invoice) {
      invoice = await this.invoiceRepository.save({
        subscription,
        providerInvoiceId: invoiceStripe.id,
        amountDue: invoiceStripe.amount_due,
        amountPaid: invoiceStripe.amount_paid,
        currency: invoiceStripe.currency,
        status: 'paid',
        hostedInvoiceUrl: invoiceStripe.hosted_invoice_url,
        pdfUrl: invoiceStripe.invoice_pdf,
      });
    }

    let payment = await this.paymentRepository.findOne({
      where: {
        providerPaymentId:
          invoiceStripe.payment_intent || `invoice_${invoiceStripe.id}`,
      },
    });
    if (!payment) {
      payment = await this.paymentRepository.save({
        invoice,
        providerPaymentId:
          invoiceStripe.payment_intent ?? `invoice_${invoiceStripe.id}`,
        amount: invoiceStripe.amount_paid,
        currency: invoiceStripe.currency,
        status: 'paid',
      });
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    await this.subscriptionRepository.save(subscription);
  }

  async paymentFailed(subscriptionId: string, invoiceStripe: any) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    await this.invoiceRepository.save({
      subscription,
      providerInvoiceId: invoiceStripe.id,
      amountDue: invoiceStripe.amount_due,
      amountPaid: 0,
      currency: invoiceStripe.currency,
      status: 'failed',
      hostedInvoiceUrl: invoiceStripe.hosted_invoice_url,
      pdfUrl: invoiceStripe.invoice_pdf,
    });

    subscription.status = SubscriptionStatus.PAST_DUE;
    await this.subscriptionRepository.save(subscription);
  }
}
