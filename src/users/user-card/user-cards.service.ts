import { Injectable } from '@nestjs/common';
import { UserCardsRepository } from './user-cards.repository';
import { UserCard } from './user-card.entity';

@Injectable()
export class UserCardsService {
  constructor(private readonly userCardsRepository: UserCardsRepository) {}

  async saveCardToUser(card: UserCard): Promise<void> {
    return this.userCardsRepository.saveCardToUser(card);
  }

  async createAndSaveCardToUser(data): Promise<void> {
    return this.userCardsRepository.createAndSaveCardToUser(data);
  }
}
