import { Controller, Get } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './card.model';

@Controller('cards')
export class CardsController {
  constructor(private CardsService: CardsService) {}

  @Get()
  getAllCards(): Card[] {
    return this.CardsService.getAllCards();
  }
}
