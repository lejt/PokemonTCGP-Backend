import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { InitialCardSeedService } from './initial-card-seed/initial-card-seed.service';

@Module({
  imports: [CardsModule],
  providers: [InitialCardSeedService],
})
export class AppModule {}
