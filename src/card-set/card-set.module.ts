import { Module } from '@nestjs/common';
import { CardSetRepository } from 'src/card-set/card-set.repository';
import { CardSet } from './card-set.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CardSet])],
  controllers: [],
  providers: [CardSetRepository],
})
export class CardSetModule {}
