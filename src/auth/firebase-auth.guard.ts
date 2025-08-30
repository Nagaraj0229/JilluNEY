// firebase-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.split(' ')[1];
    try {
      // 1. Verify Firebase JWT
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.firebaseUser = decodedToken;

      // 2. Find user in MongoDB
      const userDoc = await this.usersService.findByUid(decodedToken.uid);
      if (!userDoc) {
        throw new UnauthorizedException('User not found in database');
      }

      // 3. Attach to request
      req.userDoc = userDoc;
      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
