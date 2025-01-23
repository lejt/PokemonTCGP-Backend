import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { ERROR_MESSAGES } from 'src/constants/error-codes-and-messages';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  // TODO - bug: currently, a user may use another authorized bearer token to make calls
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const existingUser = await this.usersRepository.findOne({
      where: { id: user?.id },
    });
    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return true;
  }
}
