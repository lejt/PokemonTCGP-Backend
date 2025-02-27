import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entity/user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials-dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async findUserById(id: string): Promise<User> {
    return this.usersRepository.findUserById(id);
  }

  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ username: string }> {
    return this.usersRepository.createUser(authCredentialsDto);
  }
}
