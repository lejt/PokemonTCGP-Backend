import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { GenerateCardsDto } from './dto/generate-cards.dto';
import { GetCurrentUser } from '../auth/decorator/get-user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { Card } from './entity/card.entity';

@Controller('cards')
@UseGuards(AuthGuard(), UserAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getAllCards(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{
    data: Card[];
    pagination: {
      currentPage: number;
      nextPage: number;
      totalItems: number;
      totalPages: number;
      limit: number;
    };
  }> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const { data, pagination } = await this.cardsService.getAllCards(
      pageNum,
      limitNum,
    );

    // TODO: consider caching this request since it is static payload
    return {
      data,
      pagination,
    };
  }

  // post req used here as generate functions are non-idempotent
  @Post('generate-pack')
  generateAndAddCardsToUser(
    @Body('cardSetAndPackId') cardSetAndPackId: GenerateCardsDto,
    @GetCurrentUser() user: UserDto,
  ): Promise<any> {
    const { cardSetExternalId, packId } = cardSetAndPackId;
    return this.cardsService.generateCards(cardSetExternalId, packId, user.id);
  }
}
