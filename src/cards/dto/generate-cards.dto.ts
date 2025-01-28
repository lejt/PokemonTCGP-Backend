import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateCardsDto {
  @IsString()
  cardSetExternalId: string;

  @IsOptional()
  @IsNumber()
  packId: number;
}
