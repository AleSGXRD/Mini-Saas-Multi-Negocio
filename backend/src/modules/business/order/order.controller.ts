import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { BusinessActiveGuard } from '@modules/saas/business/guard/business-active.guard';
import { BusinessId } from '@modules/saas/business/decorator/business.decorator';
import { CreateBusinessDto } from '@modules/saas/business/dto/create-business.dto';
import { ClerkAuthGuard } from '@modules/auth-clerk/guard/clerk-auth.guard';

@Controller('order')
@UseGuards(BusinessActiveGuard, ClerkAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@BusinessId() businessId: string) {
    return this.orderService.findMany(businessId);
  }

  @Post()
  create(
    @BusinessId() businessId: string,
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    return this.orderService.create(businessId, createBusinessDto);
  }
}
