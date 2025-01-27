import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from '../auth/decorator/get-user.decorator';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Throttle } from '@nestjs/throttler';
import { AddCardDto, AddMultipleCardsDto } from '../cards/dto/add-cards.dto';
import { plainToClass } from 'class-transformer';
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

  // TODO: think about what should be returned
  // TODO: to prevent endpoint abuse, consider hashing id in frontend or proxy api calls
  // in the backend, the id can be decrypted i.e. using middleware
  // @Throttle({ default: { limit: 1, ttl: 6000 } })
  @Post('me/cards/:cardId')
  async addCardToUser(
    @Param('cardId') cardId: string,
    @GetCurrentUser() user: UserDto,
  ): Promise<any> {
    const dto = plainToClass(AddCardDto, { cardId });
    return this.usersService.addCardToUser(user.id, dto.cardId);
  }

  // @Throttle({ default: { limit: 1, ttl: 6000 } })
  @Post('me/cards')
  async addMultipleCardsToUser(
    @Body('cardIds') cardIds: string[],
    @GetCurrentUser() user: UserDto,
  ): Promise<any> {
    const dto = plainToClass(AddMultipleCardsDto, { cardIds });
    return this.usersService.addMultipleCardsToUser(user.id, dto.cardIds);
  }

  @Get('me/cards')
  async getUserCards(
    @GetCurrentUser() user: UserDto,
    @Query() cardFilters: GetCardsFilterDto,
  ): Promise<UserCard[]> {
    return this.userCardsService.getCardsFromUser(user.id, cardFilters);
  }
}
