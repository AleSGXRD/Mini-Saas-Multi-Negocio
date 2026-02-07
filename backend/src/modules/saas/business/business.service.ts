import { Injectable } from '@nestjs/common';
import { Business, BusinessStatus } from './entities/business.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { Membership } from './entities/membership.entity';
import { Plan, PlanCode } from '../subscription/entities/plan.entity';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,

    private billingService: BillingService,
  ) {}

  getBusinessesByUser(userId: string) {
    return this.businessRepository.find({
      where: {
        memberships: {
          user: { id: userId },
        },
      },
      relations: ['memberships'],
    });
  }

  async create(userId: string, createBusinessDto: CreateBusinessDto) {
    const plan = await this.planRepository.findOneBy({
      code: createBusinessDto.plan,
    });

    const business = this.businessRepository.create({
      name: createBusinessDto.name,
      plan,
      status:
        plan.code === PlanCode.FREE
          ? BusinessStatus.ACTIVE
          : BusinessStatus.PENDING_PAYMENT,
    });
    const businessSaved = await this.businessRepository.save(business);

    const membership = this.membershipRepository.create({
      user: { id: userId },
      business: businessSaved,
      role: 'owner',
    });
    const membershipSaved = await this.membershipRepository.save(membership);

    let checkoutUrl: string | null = null;

    if (plan.code !== PlanCode.FREE) {
      await this.billingService.createCheckout(business, plan);

      checkoutUrl = await this.billingService.createCheckout(
        businessSaved,
        plan,
      );
    }

    return {
      business: businessSaved,
      membership: membershipSaved,
      checkoutUrl,
      message: 'Business created successfully',
    };
  }
}
