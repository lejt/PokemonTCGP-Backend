import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardSet } from './entity/card-set.entity';
import { ERROR_MESSAGES } from 'src/constants/error-codes-and-messages';

@Injectable()
export class CardSetsRepository extends Repository<CardSet> {
  constructor(private dataSource: DataSource) {
    super(CardSet, dataSource.createEntityManager());
  }
  private logger = new Logger('CardSetsRepository', { timestamp: true });

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
      this.logger.error(`Failed to save set: ${cardSet}`, error.stack);
      throw new InternalServerErrorException(ERROR_MESSAGES.SEED_SAVE_FAILURE);
    }
  }

  // function is more of updating existing card set records with information not found in seedCards function
  async saveSeedSets(setsData: any[]): Promise<void> {
    this.logger.log('Starting the set update process...');
    try {
      const setDataToUpdate = await Promise.all(
        setsData.map(async (set) => {
          const existingSet = await this.findOne({
            where: { externalId: set.id },
          });
          if (!existingSet) return null;

          const setToUpdate = {};

          setToUpdate['externalId'] = existingSet.externalId;
          setToUpdate['name'] = existingSet.name;
          if (set.logo && !existingSet.logo) setToUpdate['logo'] = set.logo;
          if (set.symbol && !existingSet.symbol)
            setToUpdate['symbol'] = set.symbol;
          if (set.releaseDate && !existingSet.releaseDate)
            setToUpdate['releaseDate'] = set.releaseDate;

          // ignore set update if no new properties to update
          if (!(Object.keys(setToUpdate).length > 2)) return null;
          return setToUpdate;
        }),
      );
      const filteredSetData = setDataToUpdate.filter((set) => set !== null);
      this.logger.log(`${filteredSetData.length} sets need update`);
      if (!filteredSetData.length) return;

      for (const setToBeUpdated of filteredSetData) {
        await this.upsert(setToBeUpdated, {
          conflictPaths: ['externalId'],
          skipUpdateIfNoValuesChanged: true,
        });
      }
      this.logger.log('Sets updated succesfully.');
    } catch (error) {
      this.logger.error(`Failed to update set data: ${setsData}`, error.stack);
      throw new InternalServerErrorException(ERROR_MESSAGES.SEED_SAVE_FAILURE);
    }
  }
}
