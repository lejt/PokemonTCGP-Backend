import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardRepository } from './card.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { InitialCardSeedService } from 'src/initial-card-seed/initial-card-seed.service';
import { CardSetRepository } from 'src/card-sets/card-set.repository';
import { PackRepository } from 'src/packs/pack.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CardsController],
  providers: [
    CardsService,
    CardRepository,
    InitialCardSeedService,
    CardSetRepository,
    PackRepository,
  ],
})
export class CardsModule {}
