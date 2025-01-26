import { Injectable } from '@nestjs/common';
import { UserCardsRepository } from './user-cards.repository';
import { User } from '../users/entity/user.entity';
import { Card } from '../cards/entity/card.entity';

@Injectable()
export class UserCardsService {
  constructor(private readonly userCardsRepository: UserCardsRepository) {}

  async addOrUpdateUserCard(user: User, card: Card): Promise<void> {
    return this.userCardsRepository.addOrUpdateUserCard(user, card);
  }

  async addMultipleUserCards(user: User, cards: Card[]): Promise<void> {
    return this.userCardsRepository.addMultipleUserCards(user, cards);
  }
}
