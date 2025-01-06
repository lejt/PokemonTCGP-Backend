import { Injectable } from '@nestjs/common';
import { Card } from './card.model';

@Injectable()
export class CardsService {
  private cards: Card[] = [];

  getAllCards(): Card[] {
    return this.cards;
  }
}
