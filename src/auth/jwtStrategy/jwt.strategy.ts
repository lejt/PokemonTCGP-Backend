import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { User } from '../../users/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // on each request that requires a token, user will be checked
  async validate(payload: JwtPayload): Promise<UserDto> {
    const { username } = payload;
    const user: User = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
