import { Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  getAllCardIds(): Promise<number[]> {
    return this.cardsRepository.getCardIds();
  }
}
