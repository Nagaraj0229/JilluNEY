import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface FirebaseUserToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  [k: string]: any;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): FirebaseUserToken | undefined => {
    const req = ctx.switchToHttp().getRequest() as any;
    return req.user as FirebaseUserToken | undefined;
  },
);
