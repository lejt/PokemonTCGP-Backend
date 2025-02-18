import { IsNumber, IsOptional } from 'class-validator';

export class GenerateCardsDto {
  @IsNumber()
  cardSetId: number;

  @IsOptional()
  @IsNumber()
  packId: number;
}
