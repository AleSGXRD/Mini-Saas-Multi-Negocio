import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { BusinessService } from '@modules/saas/business/business.service';

@Injectable()
export class BusinessActiveGuard implements CanActivate {
  constructor(private businessService: BusinessService) {}
  private readonly logger: Logger = new Logger();

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['x-business-id'];
    if (!authorization) {
      return false;
    }
    console.log('Business ID from header:', authorization);
    try {
      const payload =
        await this.businessService.verifyBusinessPayment(authorization);
      console.log('Business payload:', payload);

      request.business = payload;
    } catch (err) {
      console.error('Error verifying business payment:', err);
      this.logger.error(err);
      return false;
    }
    return true;
  }
}
