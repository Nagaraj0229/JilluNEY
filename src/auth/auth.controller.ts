import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { CurrentUser, FirebaseUserToken } from './current-user.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async me(@CurrentUser() token: FirebaseUserToken) {
    const user = await this.users.upsertFromFirebaseToken(token);
    return { token: { uid: token.uid, email: token.email }, user };
  }
}
