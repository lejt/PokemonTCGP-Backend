import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { GenerateCardsDto } from './dto/generate-cards.dto';
import { GetCurrentUser } from '../auth/decorator/get-user.decorator';
import { UserDto } from '../users/dto/user.dto';

@Controller('cards')
@UseGuards(AuthGuard(), UserAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  getAllCards(): Promise<number[]> {
    return this.cardsService.getAllCardIds();
  }

  // post req used here as generate functions are non-idempotent
  @Post('generatePack')
  generateAndAddCardsToUser(
    @Body('cardSetAndPackId') cardSetAndPackId: GenerateCardsDto,
    @GetCurrentUser() user: UserDto,
  ): Promise<any> {
    const { cardSetExternalId, packId } = cardSetAndPackId;
    return this.cardsService.generateCards(cardSetExternalId, packId, user.id);
  }
}
