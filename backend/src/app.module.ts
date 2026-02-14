import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/auth-clerk/auth/entities/auth.entity';
import { AuthModule } from './modules/auth-clerk/auth/auth.module';
import { ClerkClientProvider } from './modules/auth-clerk/providers/clerk.provider';
import { Business } from '@modules/saas/business/entities/business.entity';
import { Membership } from '@modules/saas/business/entities/membership.entity';
import { Subscription } from '@modules/saas/subscription/entities/subscription.entity';
import { Payment } from '@modules/saas/billing/entities/payment.entity';
import { Plan } from '@modules/saas/subscription/entities/plan.entity';
import { DatabaseModule } from '@database/database.module';
import { Invoice } from '@modules/saas/billing/entities/invoice.entity';
import { SaasModule } from '@modules/saas/saas.module';
import { OrderModule } from './modules/business/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        User,
        Business,
        Membership,
        Subscription,
        Invoice,
        Payment,
        Plan,
      ],
      synchronize: true,
    }),
    DatabaseModule,
    AuthModule,
    SaasModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClerkClientProvider],
  exports: [TypeOrmModule],
})
export class AppModule {}
