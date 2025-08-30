import { applyDecorators, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { RolesGuard } from './roles.guard';

export function AuthRole(...roles: string[]) {
  return applyDecorators(
    UseGuards(FirebaseAuthGuard),
    UseGuards(new RolesGuard(roles)),
  );
}
