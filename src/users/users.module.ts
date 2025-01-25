import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { UsersController } from './users.controller';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { CardsModule } from '../cards/cards.module';
import { UserCardsModule } from './user-card/user-cards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => CardsModule),
    UserCardsModule,
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
