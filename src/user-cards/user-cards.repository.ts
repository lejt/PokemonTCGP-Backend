import { DataSource, Repository } from 'typeorm';
import { UserCard } from './entity/user-card.entity';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { Card } from '../cards/entity/card.entity';

@Injectable()
export class UserCardsRepository extends Repository<UserCard> {
  constructor(private dataSource: DataSource) {
    super(UserCard, dataSource.createEntityManager());
  }
  private logger = new Logger('UserCardsRepository');

  async addOrUpdateUserCard(user: User, card: Card): Promise<void> {
    const existingUserCard = await this.findOne({
      where: { user: { id: user.id }, card: { id: card.id } },
    });
    try {
      if (existingUserCard) {
        existingUserCard.quantity++;
        await this.save(existingUserCard);
        this.logger.log(`Card with id: ${card.id} succesfully updated`);
      } else {
        const newUserCard = this.create({ user, card, quantity: 1 });
        await this.save(newUserCard);
        this.logger.log(`Card with id: ${card.id} succesfully added`);
      }
    } catch (error) {
      this.logger.error('Failed to add userCard to user', error.stack);
    }
  }

  async addMultipleUserCards(user: User, cards: Card[]): Promise<void> {
    for (const card of cards) {
      await this.addOrUpdateUserCard(user, card);
    }
  }
}
