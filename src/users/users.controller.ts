import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
@UseGuards(AuthGuard(), UserAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('me/cards/:cardId')
  async addCardToUser(
    @Param('cardId') cardId: number,
    @GetUser() user: UserDto,
  ): Promise<any> {
    this.usersService.addCardToUser(user.id, cardId);
  }
}
