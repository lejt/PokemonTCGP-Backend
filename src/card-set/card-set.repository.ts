import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardSet } from './card-set.entity';

@Injectable()
export class CardSetRepository extends Repository<CardSet> {
  constructor(private dataSource: DataSource) {
    super(CardSet, dataSource.createEntityManager());
  }

  async findAndSaveSet(cardSet): Promise<CardSet> {
    if (!cardSet?.name) return;

    const foundSet = await this.findOne({
      where: { name: cardSet.name },
    });
    if (foundSet) return foundSet;

    try {
      const newSet = this.create({
        name: cardSet.name,
        externalId: cardSet.id,
      });
      return await this.save(newSet);
    } catch (error) {
      // Because of async nature of saving cards/cardSets, the foundSet logic above may
      // not always resolve in time, thus, the logic below helps handle these dup cases
      // Handle unique constraint violation
      if (error.code === '23505') {
        return await this.findOne({ where: { name: cardSet.name } });
      }
      throw error;
    }
  }

  // function is more of updating existing card set records with information not found in seedCards function
  async seedSets(setsData: any[]): Promise<void> {
    try {
      for (const set of setsData) {
        await this.upsert(
          {
            name: set.name,
            externalId: set.id,
            logo: set.logo,
            symbol: set.symbol,
            releaseDate: set.releaseDate,
          },
          {
            conflictPaths: ['externalId'],
            skipUpdateIfNoValuesChanged: true,
          },
        );
      }
    } catch (error) {
      throw new Error(`Failed to seed/update card sets: ${error.message}`);
    }
  }
}
