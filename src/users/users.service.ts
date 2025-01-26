import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entity/user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials-dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async addCardToUser(userId: string, cardId: number): Promise<void> {
    return this.usersRepository.addCardToUser(userId, cardId);
  }

  async addMultipleCardsToUser(
    userId: string,
    cardIds: number[],
  ): Promise<void> {
    return this.usersRepository.addMultipleCardsToUser(userId, cardIds);
  }
}
