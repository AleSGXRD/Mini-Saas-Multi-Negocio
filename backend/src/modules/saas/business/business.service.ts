import { Injectable, NotFoundException } from '@nestjs/common';
import { Business, BusinessStatus } from './entities/business.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { Membership } from './entities/membership.entity';
import { Plan, PlanCode } from '../subscription/entities/plan.entity';
import { SubscriptionService } from '../subscription/subscription.service';
import { generateId } from 'src/utils/id-generator';
import { SubscriptionStatus } from '../subscription/entities/subscription.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,

    private subscriptionService: SubscriptionService,
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

  getBusiness(businessId: string) {
    return this.businessRepository.findOne({
      where: {
        id: businessId,
      },
    });
  }

  async create(userId: string, createBusinessDto: CreateBusinessDto) {
    const plan = await this.planRepository.findOneBy({
      code: createBusinessDto.plan,
    });
    let publicId = `${generateId('bs')}`;
    let conflict = true;

    do {
      const existingBusiness = await this.businessRepository.findOneBy({
        publicId: publicId,
      });
      if (!existingBusiness) {
        conflict = false;
      } else {
        publicId = `${generateId('bs')}`;
      }
    } while (conflict);

    const business = this.businessRepository.create({
      publicId: publicId,
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
      checkoutUrl = await this.subscriptionService.createSubscription(
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

  async verifyBusinessPayment(publicId: string) {
    const business = await this.businessRepository.findOne({
      where: { publicId },
      relations: ['plan'],
    });
    console.log('Verifying payment for business:', business);
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    if (business.plan.code === PlanCode.FREE) {
      return true;
    }
    const { id: businessId } = business;

    const subscription =
      await this.subscriptionService.findBusinessSubscription(businessId);
    console.log(
      'Found subscription for business:',
      subscription,
      'with status:',
      subscription?.status,
    );
    if (subscription && subscription.status === SubscriptionStatus.ACTIVE) {
      return {
        sub: business.id,
        plan: business.plan.code,
      };
    } else {
      throw new NotFoundException(
        'Active subscription not found for this business',
      );
    }
  }
}
