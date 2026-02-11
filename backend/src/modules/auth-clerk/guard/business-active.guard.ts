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
    const token = authorization;
    if (!token) {
      return false;
    }
    try {
      const payload = await this.businessService.verifyBusinessPayment(token);

      request.business = payload;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
    return true;
  }
}
