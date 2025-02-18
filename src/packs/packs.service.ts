import { Injectable } from '@nestjs/common';
import { PacksRepository } from './packs.repository';
import { Pack } from './entity/pack.entity';
import { CardSet } from '../card-sets/entity/card-set.entity';
import { Card } from '../initial-card-seed/interface/external-data.interface';

@Injectable()
export class PacksService {
  constructor(private readonly packsRepository: PacksRepository) {}

  async findPackByName(packName: string): Promise<Pack> {
    return this.packsRepository.findPackByName(packName);
  }

  async findPackById(id: number): Promise<Pack> {
    return this.packsRepository.findOneBy({ id });
  }

  async findAndSavePack(card: Card, cardSet: CardSet): Promise<Pack> {
    return this.packsRepository.findAndSavePack(card, cardSet);
  }
}
