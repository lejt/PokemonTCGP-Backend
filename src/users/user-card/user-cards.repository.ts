import { DataSource, Repository } from 'typeorm';
import { UserCard } from './user-card.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCardsRepository extends Repository<UserCard> {
  constructor(private dataSource: DataSource) {
    super(UserCard, dataSource.createEntityManager());
  }

  async saveCardToUser(card: UserCard): Promise<void> {
    this.save(card);
  }

  async createAndSaveCardToUser(data): Promise<void> {
    const userCard = this.create(data);

    await this.save(userCard);
  }
}
