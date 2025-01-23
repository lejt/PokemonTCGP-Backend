import { Controller, Get, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';

@Controller('cards')
@UseGuards(AuthGuard(), UserAuthGuard)
export class CardsController {
  constructor(private readonly CardsService: CardsService) {}

  @Get()
  getAllCards(): Promise<number[]> {
    return this.CardsService.getAllCardIds();
  }
}
