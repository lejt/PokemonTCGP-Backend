import { Injectable } from '@nestjs/common';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { Card, Set } from 'pokemon-tcg-sdk-typescript/dist/sdk';

@Injectable()
export class InitialCardSeedService {
  private allCards: Card[] = [];
  private allSets: Set[] = [];

  async getAllCards(): Promise<Card[]> {
    this.allCards = await PokemonTCG.getAllCards();
    return this.allCards;
  }

  async getAllSet(): Promise<Set[]> {
    this.allSets = await PokemonTCG.getAllSets();
    return this.allSets;
  }
}
