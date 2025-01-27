import { Module } from '@nestjs/common';
import { InitialCardSeedService } from './initial-card-seed.service';
import { CardsModule } from 'src/cards/cards.module';
import { CardSetsModule } from 'src/card-sets/card-sets.module';

@Module({
  imports: [CardsModule, CardSetsModule],
  providers: [InitialCardSeedService],
})
export class InitialCardSeedModule {}
