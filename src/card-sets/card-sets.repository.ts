import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardSet } from './entity/card-set.entity';

@Injectable()
export class CardSetsRepository extends Repository<CardSet> {
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
  async saveSeedSets(setsData: any[]): Promise<void> {
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
      if (!filteredSetData.length) return;

      await console.log('Updating set initialized...');

      for (const setToBeUpdated of filteredSetData) {
        await this.upsert(setToBeUpdated, {
          conflictPaths: ['externalId'],
          skipUpdateIfNoValuesChanged: true,
        });
      }
      await console.log('Sets updated succesfully.');
    } catch (error) {
      throw new Error(`Failed to seed/update card sets: ${error.message}`);
    }
  }
}
