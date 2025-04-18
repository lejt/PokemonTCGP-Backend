import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { ERROR_MESSAGES } from '../constants/error-codes-and-messages';
import * as bcryptjs from 'bcryptjs';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  private logger = new Logger('AuthService');

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ username: string }> {
    return this.usersService.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersService.findUserByUsername(username);

    if (user && (await bcryptjs.compare(password, user.password))) {
      this.logger.log(`Signing in user: ${username}`);
      const payload: JwtPayload = { username, sub: user.id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      this.logger.warn(`Failed to log-in user: ${username}`);
      throw new UnauthorizedException(ERROR_MESSAGES.LOG_IN_FAILURE);
    }
  }

  async validateToken(tokenObject: { accessToken: string }): Promise<boolean> {
    try {
      const { accessToken } = tokenObject;
      const decoded = this.jwtService.verify(accessToken);
      return !!decoded;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
