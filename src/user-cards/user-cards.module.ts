import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCard } from './entity/user-card.entity';
import { UserCardsRepository } from './user-cards.repository';
import { UserCardsService } from './user-cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCard])],
  controllers: [],
  providers: [UserCardsRepository, UserCardsService],
  exports: [UserCardsService],
})
export class UserCardsModule {}
