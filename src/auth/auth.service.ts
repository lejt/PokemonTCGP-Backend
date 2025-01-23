import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { ERROR_MESSAGES } from 'src/constants/error-codes-and-messages';
import * as bcryptjs from 'bcryptjs';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  private logger = new Logger('AuthService');

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcryptjs.compare(password, user.password))) {
      const payload: JwtPayload = { username, sub: user.id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      this.logger.warn(`Failed to log-in user: ${username}`);
      throw new UnauthorizedException(ERROR_MESSAGES.LOG_IN_FAILURE);
    }
  }
}
