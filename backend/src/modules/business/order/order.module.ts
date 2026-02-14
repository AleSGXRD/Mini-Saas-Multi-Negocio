import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { BusinessModule } from '@modules/saas/business/business.module';
import { AuthModule } from '@modules/auth-clerk/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), BusinessModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
