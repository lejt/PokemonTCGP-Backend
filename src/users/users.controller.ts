import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from '../auth/decorator/get-user.decorator';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserCard } from '../user-cards/entity/user-card.entity';
import { GetCardsFilterDto } from '../cards/dto/get-card-filter.dto';
import { UserCardsService } from '../user-cards/user-cards.service';

@Controller('users')
@UseGuards(AuthGuard(), UserAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userCardsService: UserCardsService,
  ) {}

  @Get('me/cards')
  async getUserCards(
    @GetCurrentUser() user: UserDto,
    @Query() cardFilters: GetCardsFilterDto,
  ): Promise<UserCard[]> {
    return this.userCardsService.getCardsFromUser(user.id, cardFilters);
  }
}
