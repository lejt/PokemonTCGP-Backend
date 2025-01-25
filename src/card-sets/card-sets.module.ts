import { Module } from '@nestjs/common';
import { CardSetsRepository } from '../card-sets/card-sets.repository';
import { CardSet } from './entity/card-set.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreAuthModules } from '../core-auth-modules/core-auth-modules.module';
import { CardSetsService } from './card-sets.service';

@Module({
  imports: [TypeOrmModule.forFeature([CardSet]), CoreAuthModules],
  providers: [CardSetsRepository, CardSetsService],
  exports: [CardSetsService],
})
export class CardSetsModule {}
