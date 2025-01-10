import { DataSource, ILike, Repository } from 'typeorm';
import { Pack } from './pack.entity';
import { Injectable } from '@nestjs/common';
import { CardSet } from 'src/card-sets/card-set.entity';
import { getGAPackName } from 'src/utils/pack-utils';

@Injectable()
export class PackRepository extends Repository<Pack> {
  constructor(private dataSource: DataSource) {
    super(Pack, dataSource.createEntityManager());
  }

  async getPacks(): Promise<Pack[]> {
    const packs = [];

    return packs;
  }

  async findPackByName(packName): Promise<Pack> {
    return await this.findOne({
      where: { name: ILike(`%${packName}%`) },
    });
  }

  async findAndSavePack(card, cardSet: CardSet): Promise<Pack> {
    const packName = getGAPackName(card.id);
    if (!packName) return;

    await this.upsert(
      {
        name: packName,
        cardSet, // here to associate the cardset to pack
      },
      {
        conflictPaths: ['name'],
        skipUpdateIfNoValuesChanged: true,
      },
    );

    return await this.findOne({ where: { name: packName } });
  }
}
