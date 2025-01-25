import { Injectable } from '@nestjs/common';
import { CardSetsRepository } from './card-sets.repository';
import { CardSet } from './entity/card-set.entity';
import { Set, SetResume } from 'src/initial-card-seed/external-data.interface';

@Injectable()
export class CardSetsService {
  constructor(private readonly cardSetsRepository: CardSetsRepository) {}

  async findAndSaveSet(cardSet: SetResume): Promise<CardSet> {
    return this.cardSetsRepository.findAndSaveSet(cardSet);
  }

  async updateSeededSet(setsData: Set[]): Promise<void> {
    return this.cardSetsRepository.saveSeedSets(setsData);
  }
}
