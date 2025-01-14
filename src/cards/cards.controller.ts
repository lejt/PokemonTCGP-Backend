import { Controller, Get } from '@nestjs/common';
import { CardsService } from './cards.service';
import { InitialCardSeedService } from 'src/initial-card-seed/initial-card-seed.service';
// import { Card } from './card.model';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly CardsService: CardsService,
    private readonly InitialCardSeedService: InitialCardSeedService,
  ) {}

  @Get()
  getAllCards(): any {
    // getAllCards(): Card[] {
    return this.CardsService.getAllCards();
  }
}
