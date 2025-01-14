import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './cards.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { InitialCardSeedService } from 'src/initial-card-seed/initial-card-seed.service';
import { CardSetsRepository } from 'src/card-sets/card-sets.repository';
import { PacksRepository } from 'src/packs/packs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CardsController],
  providers: [
    CardsService,
    CardsRepository,
    InitialCardSeedService,
    CardSetsRepository,
    PacksRepository,
  ],
})
export class CardsModule {}
