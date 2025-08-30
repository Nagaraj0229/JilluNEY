import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowed: string[]) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest() as any;
    const user = req.userDoc; // we’ll set this in controller
    if (!user) throw new ForbiddenException('No user document found');
    if (!this.allowed.includes(user.role)) {
      throw new ForbiddenException('You do not have permission');
    }
    return true;
  }
}
