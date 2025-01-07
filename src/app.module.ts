import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { InitialCardSeedService } from './initial-card-seed/initial-card-seed.service';
import { CollectionController } from './collection/collection.controller';
import { CollectionService } from './collection/collection.service';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [CardsModule, CollectionModule],
  providers: [InitialCardSeedService, CollectionService],
  controllers: [CollectionController],
})
export class AppModule {}
