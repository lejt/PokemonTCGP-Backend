import { Injectable } from '@nestjs/common';
import { UserCardsRepository } from './user-cards.repository';
import { User } from '../users/entity/user.entity';
import { Card } from '../cards/entity/card.entity';
import { GetCardsFilterDto } from '../cards/dto/get-card-filter.dto';
import { UserCard } from './entity/user-card.entity';

@Injectable()
export class UserCardsService {
  constructor(private readonly userCardsRepository: UserCardsRepository) {}

  async getCardsFromUser(
    userId: string,
    cardFilters: GetCardsFilterDto,
  ): Promise<UserCard[]> {
    return this.userCardsRepository.getCardFromUser(userId, cardFilters);
  }

  async addOrUpdateUserCard(user: User, card: Card): Promise<void> {
    return this.userCardsRepository.addOrUpdateUserCard(user, card);
  }

  async addMultipleUserCards(user: User, cards: Card[]): Promise<void> {
    return this.userCardsRepository.addMultipleUserCards(user, cards);
  }
}
