import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  findMany(businessId: string) {
    return this.orderRepository.find({
      where: {
        businessId,
      },
    });
  }

  create(businessId: string, createOrder: CreateOrderDto) {
    const create = this.orderRepository.create({
      businessId,
      ...createOrder,
    });
    return this.orderRepository.save(create);
  }
}
