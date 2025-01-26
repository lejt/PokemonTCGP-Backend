import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { Card } from './entity/card.entity';
import { In } from 'typeorm';
import { ERROR_MESSAGES } from '../constants/error-codes-and-messages';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}
  private logger = new Logger('CardsService');

  async getAllCardIds(): Promise<number[]> {
    return this.cardsRepository.getCardIds();
  }

  async findCardById(cardId: number): Promise<Card | null> {
    return this.cardsRepository.findOneBy({ id: cardId });
  }

  async findCardsByIds(cardIds: number[]): Promise<Card[] | null> {
    // return this.cardsRepository.findBy({ id: In(cardIds) });
    if (!cardIds.length) return null;

    // fetch unique card Ids, typeORM .find only performs unique searches
    const uniqueCardIds = Array.from(new Set(cardIds));
    const cards = await this.cardsRepository.findBy({ id: In(uniqueCardIds) });

    // Map original cardIds to match the duplicate records as needed
    const cardMap = new Map(cards.map((card) => [card.id, card]));
    const result = cardIds.map((id) => {
      const card = cardMap.get(id);
      if (!card) {
        this.logger.warn(`Card id: ${card.id} not found`);
        throw new NotFoundException(ERROR_MESSAGES.CARD_NOT_FOUND);
      }
      return card;
    });

    return result;
  }
}
