import { Module } from '@nestjs/common';
import { CardSetsRepository } from 'src/card-sets/card-sets.repository';
import { CardSet } from './entity/card-set.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CardSet]), AuthModule],
  controllers: [],
  providers: [CardSetsRepository],
})
export class CardSetsModule {}
