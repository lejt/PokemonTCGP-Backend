import { Injectable } from '@nestjs/common';
import { CardSetsRepository } from './card-sets.repository';
import { CardSet } from './entity/card-set.entity';
import {
  Set,
  SetResume,
} from '../initial-card-seed/interface/external-data.interface';
import { CardSetAndPack } from './interfaces/card-sets.interface';

@Injectable()
export class CardSetsService {
  constructor(private readonly cardSetsRepository: CardSetsRepository) {}

  async findSetById(id: number): Promise<CardSet> {
    return this.cardSetsRepository.findOneBy({ id });
  }

  async findAndSaveSet(cardSet: SetResume): Promise<CardSet> {
    return this.cardSetsRepository.findAndSaveSet(cardSet);
  }

  async updateSeededSet(setsData: Set[]): Promise<void> {
    return this.cardSetsRepository.saveSeedSets(setsData);
  }

  async getAllCardSets(): Promise<CardSet[]> {
    return this.cardSetsRepository.find();
  }

  async getCardSetAndPackData(): Promise<CardSetAndPack[]> {
    const cardSets = await this.getAllCardSets();
    const cardSetAndPacks = [];
    cardSets.forEach((cs) => {
      if (cs.name === 'Promos-A') return; // omit this pack since it is promos

      cardSetAndPacks.push({
        id: cs.id,
        name: cs.name,
        logo: cs.logo,
        image: cs.logo, // TODO: replace with cardset image
        packs:
          cs.packs?.map((pack) => {
            return { id: pack.id, image: pack.name }; // TODO: replace pack.name with pack image
          }) || [],
      });
    });

    return cardSetAndPacks;
  }
}
