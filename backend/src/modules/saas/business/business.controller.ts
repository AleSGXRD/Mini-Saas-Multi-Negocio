import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { ClerkAuthGuard } from '@modules/auth-clerk/guard/clerk-auth.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UserId } from '@modules/auth-clerk/decorators/user.decorator';

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
}
