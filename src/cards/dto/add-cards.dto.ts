import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class AddCardDto {
  @Type(() => Number)
  @IsInt({ message: 'card id must be a valid integer' })
  cardId: number;
}

export class AddMultipleCardsDto {
  @IsArray({ message: 'card ids must be an array' })
  @ArrayNotEmpty({ message: 'card ids array must not be empty' })
  @Type(() => Number)
  cardIds: number[];
}
