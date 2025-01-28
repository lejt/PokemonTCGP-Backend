import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from '../../constants/error-codes-and-messages';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  // TODO - bug: currently, a user may use another authorized bearer token to make calls
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const existingUser = await this.usersService.findUserByUsername(user?.username);
    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return true;
  }
}
