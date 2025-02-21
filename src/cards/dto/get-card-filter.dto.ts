import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';

export class GetCardsFilterDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortByDto)
  sortBy?: SortByDto[];
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortByDto {
  @IsEnum(['id', 'rarity', 'types', 'updatedAt', 'quantity'], {
    message: 'Invalid sortBy field',
  })
  field: 'id' | 'rarity' | 'types' | 'updatedAt' | 'quantity';

  @IsEnum(SortOrder)
  order: SortOrder;
}
