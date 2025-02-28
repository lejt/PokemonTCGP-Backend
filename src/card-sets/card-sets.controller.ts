import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { CardSetsService } from './card-sets.service';
import { PacksService } from '../packs/packs.service';
import { CardSetAndPack } from './interfaces/card-sets.interface';

@Controller('card-sets')
@UseGuards(AuthGuard(), UserAuthGuard)
export class CardSetsController {
  constructor(
    private readonly cardSetsService: CardSetsService,
    private readonly packsService: PacksService,
  ) {}

  @Get()
  async getCardSetandPack(): Promise<CardSetAndPack[]> {
    return this.cardSetsService.getCardSetAndPackData();
  }
}
