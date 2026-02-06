import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Plan,
  PlanCode,
  PlanInterval,
} from '@modules/saas/subscription/entities/plan.entity';

@Injectable()
export class PlanSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Plan)
    private repo: Repository<Plan>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const plans = [
      { code: PlanCode.FREE, price: 0, interval: PlanInterval.MONTH },
      {
        code: PlanCode.PRO,
        price: 2900,
        stripePriceId: 'price_1SxrJhDRgWpQDPnXUZK51QPO',
        interval: PlanInterval.MONTH,
      },
      { code: PlanCode.ENTERPRISE, price: 9900, interval: PlanInterval.MONTH },
    ];

    for (const p of plans) {
      const exists = await this.repo.findOne({
        where: { code: p.code },
      });

      if (!exists) {
        await this.repo.save(p);
      } else {
        if (exists.price !== p.price || exists.interval !== p.interval) {
          exists.price = p.price;
          exists.interval = p.interval;
          if (p.stripePriceId) {
            exists.stripePriceId = p.stripePriceId;
          }
          await this.repo.save(exists);
        }
      }
    }

    console.log('✅ Plans seeded');
  }
}
