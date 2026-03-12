import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});