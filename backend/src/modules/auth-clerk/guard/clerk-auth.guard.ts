import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  private readonly logger: Logger = new Logger();

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization) {
      return false;
    }
    const token = authorization.replace('Bearer ', '');
    if (!token) {
      return false;
    }
    try {
      const payload = await clerkClient.verifyToken(token);

      const user = await this.authService.findOrCreate({
        clerkId: payload.sub,
        email: payload.email_addresses?.[0]?.email_address ?? '',
        name: payload.first_name,
      });

      request.user = user;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
    return true;
  }
}
