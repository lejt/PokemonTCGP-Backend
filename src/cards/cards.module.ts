import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { InitialCardSeedService } from 'src/initial-card-seed/initial-card-seed.service';

@Module({
  providers: [CardsService, InitialCardSeedService],
  controllers: [CardsController],
})
export class CardsModule {}
