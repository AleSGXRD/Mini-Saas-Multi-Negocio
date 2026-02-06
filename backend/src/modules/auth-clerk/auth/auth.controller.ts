import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from '../guard/clerk-auth.guard';
import { UserId } from '../decorators/user.decorator';

@Controller('auth')
@UseGuards(ClerkAuthGuard)
export class AuthController {
  @Get('me')
  getUser(@UserId() userId: string) {
    return { id: userId };
  }
}
