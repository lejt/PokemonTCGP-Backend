import { Injectable } from '@nestjs/common';
// import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
// import { Card, Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import TCGdex from '@tcgdex/sdk';
import { CardResume, Set } from './initial-card-seed.model';

@Injectable()
export class InitialCardSeedService {
  constructor() {}
  tcgdex = new TCGdex('en');

  private allCards: CardResume[] = [];
  private cardSetGeneticApex: Set;
  private cardSetMythicalIsland: Set;

  async seedCards(): Promise<any> {
    try {
      this.cardSetGeneticApex = await this.tcgdex.fetch('sets', 'A1');
      this.cardSetMythicalIsland = await this.tcgdex.fetch('sets', 'A1a');

      // TODO: separate cards and pack data, add to db
      const tempCardList = this.cardSetGeneticApex;
      return tempCardList.cards;
    } catch (error) {
      return error.message;
    }
  }

  // async getAllSet(): Promise<Set[]> {
  //   this.allSets = await PokemonTCG.getAllSets();
  //   return this.allSets;
  // }
}
