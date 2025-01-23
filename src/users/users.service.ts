import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  addCardToUser(userId: string, cardId: number): Promise<any> {
    return this.usersRepository.addCardToUser(userId, cardId);
  }
}
