import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { ClerkAuthGuard } from '@modules/auth-clerk/guard/clerk-auth.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UserId } from '@modules/auth-clerk/decorators/user.decorator';
import { BusinessActiveGuard } from '@modules/auth-clerk/guard/business-active.guard';

@Controller('business')
@UseGuards(ClerkAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  createBusiness(
    @UserId() userId: string,
    @Body() createBusiness: CreateBusinessDto,
  ) {
    return this.businessService.create(userId, createBusiness);
  }

  @Get()
  getBusinesses(@UserId() userId: string) {
    return this.businessService.getBusinessesByUser(userId);
  }

  @Get('current')
  @UseGuards(BusinessActiveGuard)
  verifyBusinessPayment(@Req() req: any) {
    const business = req.business;
    return business;
  }
}
