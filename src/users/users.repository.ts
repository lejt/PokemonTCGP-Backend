import { DataSource, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials-dto';
import * as bcryptjs from 'bcryptjs';
import {
  ERROR_CODES,
  ERROR_MESSAGES,
} from 'src/constants/error-codes-and-messages';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  private logger = new Logger('UsersRepository', { timestamp: true });

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    this.logger.log(`Creating a new user with username: ${username}`);

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);
    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
      this.logger.log(`User with username: ${username} created successfully`);
    } catch (error) {
      if (error.code === ERROR_CODES.UNIQUE_VIOLATION) {
        this.logger.warn(
          `Attempt to create duplicate username: ${username}`,
          error.stack,
        );
        throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
      } else {
        this.logger.error(
          `Failed to create user: ${username}`,
          error.message,
          error.stack,
        );
        throw new InternalServerErrorException(
          ERROR_MESSAGES.USER_CREATION_FAILURE,
        );
      }
    }
  }

  async addCardToUser(userId: string, cardId: number): Promise<void> {
    // confirm user and find all owned cards
    // find card to be added via id
    // user.ownedCards.push(card)
    // await this.usersRepository.save(user)
  }

  // create another function for multiple card adds?
}
