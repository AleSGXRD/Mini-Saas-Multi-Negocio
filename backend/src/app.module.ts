import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/auth-clerk/auth/entities/auth.entity';
import { AuthModule } from './modules/auth-clerk/auth/auth.module';
import { ClerkClientProvider } from './modules/auth-clerk/providers/clerk.provider';
import { ClerkAuthGuard } from './modules/auth-clerk/guard/clerk-auth.guard';
import { BusinessModule } from './modules/saas/business/business.module';
import { Business } from '@modules/saas/business/entities/business.entity';
import { Membership } from '@modules/saas/business/entities/membership.entity';
import { SubscriptionModule } from './modules/saas/subscription/subscription.module';
import { BillingModule } from './modules/saas/billing/billing.module';
import { Subscription } from '@modules/saas/subscription/entities/subscription.entity';
import { Payment } from '@modules/saas/business/entities/payment.entity';
import { Plan } from '@modules/saas/business/entities/plan.entity';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Business, Membership, Subscription, Payment, Plan],
      synchronize: true,
    }),
    DatabaseModule,
    AuthModule,
    BusinessModule,
    SubscriptionModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClerkClientProvider],
  exports: [TypeOrmModule],
})
export class AppModule {}
