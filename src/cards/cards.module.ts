import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './cards.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { CoreAuthModules } from '../core-auth-modules/core-auth-modules.module';
import { CardSetsModule } from '../card-sets/card-sets.module';
import { PacksModule } from '../packs/packs.module';
import { UserCardsModule } from '../user-cards/user-cards.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    CoreAuthModules,
    CardSetsModule,
    PacksModule,
    UserCardsModule,
  ],
  controllers: [CardsController],
  providers: [
    CardsService,
    CardsRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [CardsService],
})
export class CardsModule {}
