import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardRepository } from './card.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { InitialCardSeedService } from 'src/initial-card-seed/initial-card-seed.service';
import { CardSetRepository } from 'src/card-set/card-set.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CardsController],
  providers: [
    CardsService,
    CardRepository,
    InitialCardSeedService,
    CardSetRepository,
  ],
})
export class CardsModule {}
