import { Injectable } from '@nestjs/common';
import { CardSetsRepository } from './card-sets.repository';
import { CardSet } from './entity/card-set.entity';
import { Set, SetResume } from '../initial-card-seed/external-data.interface';

@Injectable()
export class CardSetsService {
  constructor(private readonly cardSetsRepository: CardSetsRepository) {}

  async findSetByExternalId(externalId: string): Promise<CardSet> {
    return this.cardSetsRepository.findOneBy({ externalId });
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
}
