import { DataSource, Repository } from 'typeorm';
import { UserCard } from './entity/user-card.entity';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { Card } from '../cards/entity/card.entity';
import { GetCardsFilterDto } from 'src/cards/dto/get-card-filter.dto';
import {
  EnergyOrder,
  Rarity,
  RarityOrder,
} from 'src/cards/interfaces/card.enum';

@Injectable()
export class UserCardsRepository extends Repository<UserCard> {
  constructor(private dataSource: DataSource) {
    super(UserCard, dataSource.createEntityManager());
  }
  private logger = new Logger('UserCardsRepository');

  async getCardFromUser(
    userId: string,
    cardFilters: GetCardsFilterDto,
  ): Promise<UserCard[]> {
    const { sortBy } = cardFilters;
    const query = this.createQueryBuilder('userCard');

    query
      .leftJoinAndSelect('userCard.card', 'card')
      .where('userCard.user_id = :userId', { userId });

    if (sortBy) {
      sortBy.forEach(({ field, order }) => {
        if (field === 'rarity') {
          const rarityCase = this.generateCaseStatement(
            'card.rarity',
            RarityOrder,
            order,
            Rarity.NONE,
          );
          query.addOrderBy(rarityCase, order);
        } else if (field === 'types') {
          const typeCase = this.generateCaseStatement(
            'card.types',
            EnergyOrder,
            order,
            null,
          );
          query.addOrderBy(typeCase, order);
        } else {
          query.addOrderBy(`userCard.${field}`, order);
        }
        query.addOrderBy('card.id', order);
      });
    }

    return await query.getMany();
  }

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

  generateCaseStatement = (
    columnName: string,
    orderMapping: Record<string, number>,
    order: 'ASC' | 'DESC',
    lastValueKey: string,
  ): string => {
    const cases = Object.entries(orderMapping)
      .filter(([key]) => key !== lastValueKey) // Exclude the last value for now
      .map(([key, value]) => `WHEN ${columnName} = '${key}' THEN ${value}`)
      .join(' ');

    const lastValueCase = `WHEN ${columnName} = '${lastValueKey}' THEN ${
      order === 'ASC' ? Object.keys(orderMapping).length : -1
    }`;

    return `CASE ${cases} ${lastValueCase} END`;
  };
}
