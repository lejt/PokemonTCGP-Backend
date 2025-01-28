import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { GenerateCardsDto } from './dto/generate-cards.dto';

@Controller('cards')
@UseGuards(AuthGuard(), UserAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  getAllCards(): Promise<number[]> {
    return this.cardsService.getAllCardIds();
  }

  // post req used here as generate functions are non-idempotent
  @Post('generate')
  generateBoosterCards(
    @Body('cardSetAndPackId') ads: GenerateCardsDto,
  ): Promise<any> {
    const { cardSetExternalId, packId } = ads;
    return this.cardsService.generateCards(cardSetExternalId, packId);
  }
}
