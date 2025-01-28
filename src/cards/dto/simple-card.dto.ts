import { Expose } from 'class-transformer';
import { Rarity } from '../interfaces/card.enum';

export class SimpleCard {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  rarity: Rarity;

  @Expose()
  image?: string;
}
