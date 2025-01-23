import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';

// after user sign in and validation, all subsequent reqs will grab user info from req
// instead of fetching from db
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
