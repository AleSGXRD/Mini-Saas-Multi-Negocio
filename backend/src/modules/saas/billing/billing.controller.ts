import { Controller, Post, Param, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscription/entities/subscription.entity';
import { Repository } from 'typeorm';
import { Public } from '@modules/auth-clerk/decorators/public.decorator';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';

@Controller('billing')
export class BillingController {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

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

    switch (event.type) {
      // ✅ PAGO EXITOSO (primer mes y recurrentes)
      case 'invoice.paid': {
        const invoiceStripe: any = event.data.object;

        const subscriptionId = invoiceStripe.metadata.subscriptionId;

        const subscription = await this.subscriptionRepo.findOne({
          where: { id: subscriptionId },
        });

        // ---------- CREATE INVOICE ----------
        const invoice = await this.invoiceRepository.save({
          subscription,
          providerInvoiceId: invoiceStripe.id,
          amountDue: invoiceStripe.amount_due,
          amountPaid: invoiceStripe.amount_paid,
          currency: invoiceStripe.currency,
          status: 'paid',
          hostedInvoiceUrl: invoiceStripe.hosted_invoice_url,
          pdfUrl: invoiceStripe.invoice_pdf,
        });

        // ---------- CREATE PAYMENT ----------
        await this.paymentRepository.save({
          invoice,
          providerPaymentId:
            invoiceStripe.payment_intent ?? `invoice_${invoiceStripe.id}`,
          amount: invoiceStripe.amount_paid,
          currency: invoiceStripe.currency,
          status: 'paid',
        });

        subscription.status = SubscriptionStatus.ACTIVE;
        await this.subscriptionRepo.save(subscription);

        break;
      }

      // ❌ PAGO FALLIDO
      case 'invoice.payment_failed': {
        const invoiceStripe: any = event.data.object;

        const subscriptionId = invoiceStripe.metadata.subscriptionId;

        const subscription = await this.subscriptionRepo.findOne({
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
        await this.subscriptionRepo.save(subscription);

        break;
      }
    }

    return { received: true };
  }
}
