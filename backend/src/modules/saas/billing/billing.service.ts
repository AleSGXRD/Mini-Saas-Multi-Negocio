import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscription/entities/subscription.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { StripeService } from '../stripe/stripe.service';
import { Business, BusinessStatus } from '../business/entities/business.entity';

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
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
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

    return session;
  }

  async paymentSuccess(
    subscriptionId: string,
    invoiceStripe: any,
    providerSubscriptionId: string,
  ) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['business'],
    });

    let invoice = await this.invoiceRepository.findOne({
      where: { providerInvoiceId: invoiceStripe.id },
    });
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
    subscription.providerSubscriptionId = providerSubscriptionId;

    const business = subscription.business;
    business.status = BusinessStatus.ACTIVE;
    await this.businessRepository.save(business);
    await this.subscriptionRepository.save(subscription);
  }

  async paymentFailed(
    subscriptionId: string,
    invoiceStripe: any,
    providerSubscriptionId: string,
  ) {
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
    subscription.providerSubscriptionId = providerSubscriptionId;
    await this.subscriptionRepository.save(subscription);
  }
}
