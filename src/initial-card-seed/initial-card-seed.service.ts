import { Injectable } from '@nestjs/common';
import TCGdex from '@tcgdex/sdk';
import { CardSetRepository } from 'src/card-sets/card-set.repository';
import { CardRepository } from 'src/cards/card.repository';

@Injectable()
export class InitialCardSeedService {
  constructor(
    private cardRepository: CardRepository,
    private cardSetRepository: CardSetRepository,
  ) {}
  tcgdex = new TCGdex('en');

  // TODO: execute this function in init of application
  async seedCards(): Promise<any> {
    try {
      const seriesData = await this.tcgdex.fetch('series', 'tcgp');

      // fetch card set ids from pokemon tcg pocket
      const setIds = seriesData.sets.map((set) => set.id);

      // fetch all data related to the set and its cards
      const setsData = await Promise.all(
        setIds.map((setId) => this.tcgdex.fetch('sets', setId)),
      );

      // flatten nested structure to abstract card ids and set ids
      const cardSetMapping = setsData.flatMap((set) =>
        set.cards.map((card) => ({
          setId: set.id,
          cardId: card.localId,
        })),
      );

      const cardsList = await Promise.all(
        cardSetMapping.map((cardSet) =>
          this.tcgdex.fetch('sets', cardSet.setId, cardSet.cardId),
        ),
      );

      await this.cardRepository.seedCards(cardsList);
      await this.cardSetRepository.seedSets(setsData);

      return 'Succesfully seeded';
    } catch (error) {
      console.log(`Service failed in seeding cards: ${error.message}`);
      throw new Error('Failed to seed cards in service');
    }
  }
}
