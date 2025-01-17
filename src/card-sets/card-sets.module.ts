import { Module } from '@nestjs/common';
import { CardSetsRepository } from 'src/card-sets/card-sets.repository';
import { CardSet } from './entity/card-set.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CardSet])],
  controllers: [],
  providers: [CardSetsRepository],
})
export class CardSetsModule {}
