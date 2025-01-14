import { Injectable } from '@nestjs/common';
import { InitialCardSeedService } from 'src/initial-card-seed/initial-card-seed.service';
// import { Card } from './card.model';

@Injectable()
export class CardsService {
  constructor(
    private readonly InitialCardSeedService: InitialCardSeedService,
  ) {}

  // getAllCards(): Card[] {
  getAllCards(): any {
    // return this.cards;
    return this.InitialCardSeedService.seedCards();
  }
}

// postgres on post 5632
