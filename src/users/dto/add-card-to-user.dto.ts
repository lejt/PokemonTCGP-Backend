import { IsUUID, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCardToUserDto {
  @IsUUID()
  userId: string;

  @IsInt()
  @Type(() => Number)
  cardId: number;
}
