import { DataSource, Repository } from 'typeorm';
import { UserCard } from './entity/user-card.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { Card } from '../cards/entity/card.entity';
import { GetCardsFilterDto } from '../cards/dto/get-card-filter.dto';
import {
  EnergyOrder,
  Rarity,
  RarityOrder,
} from '../cards/interfaces/card.enum';
import { ERROR_MESSAGES } from '../constants/error-codes-and-messages';

@Injectable()
export class UserCardsRepository extends Repository<UserCard> {
  constructor(private dataSource: DataSource) {
    super(UserCard, dataSource.createEntityManager());
  }
  private logger = new Logger('UserCardsRepository');

  async getCardsFromUser(
    userId: string,
    cardFilters: GetCardsFilterDto,
  ): Promise<UserCard[]> {
    const { sortBy } = cardFilters;
    const query = this.createQueryBuilder('userCard');
    this.logger.log(
      `Querying the user's cards by filters: ${JSON.stringify(cardFilters)}...`,
    );

    query
      .leftJoinAndSelect('userCard.card', 'card')
      .leftJoin('card.cardSet', 'cardSet')
      .addSelect(['cardSet.id', 'cardSet.name'])
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
    try {
      this.logger.log("Returning results from quering user's cards");
      const result = await query.getMany();
      return result;
    } catch (error) {
      this.logger.error(
        `User's cards not found with filters: ${JSON.stringify(cardFilters)}`,
        error.stack,
      );
      throw new NotFoundException(ERROR_MESSAGES.USER_CARD_NOT_FOUND);
    }
  }

  async addOrUpdateUserCard(user: User, card: Card): Promise<void> {
    this.logger.log(
      `Attempting to add card: ${card.name}, id: ${card.id} to user...`,
    );
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

  // function to create case statement for typeOrm queries
  generateCaseStatement = (
    columnName: string,
    orderMapping: Record<string, number>,
    order: 'ASC' | 'DESC',
    lastValueKey: string,
  ): string => {
    const cases = Object.entries(orderMapping)
      .filter(([key]) => key !== lastValueKey)
      .map(([key, value]) => `WHEN ${columnName} = '${key}' THEN ${value}`)
      .join(' ');

    const lastValueCase = `WHEN ${columnName} = '${lastValueKey}' THEN ${
      order === 'ASC' ? Object.keys(orderMapping).length : -1
    }`;

    return `CASE ${cases} ${lastValueCase} END`;
  };
}
