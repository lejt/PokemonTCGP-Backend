import { Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { Card } from './entity/card.entity';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async getAllCardIds(): Promise<number[]> {
    return this.cardsRepository.getCardIds();
  }

  async findCardById(id: number): Promise<Card | null> {
    return this.cardsRepository.findOneBy({ id });
  }
}
