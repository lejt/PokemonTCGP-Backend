import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import TCGdex from '@tcgdex/sdk';
import { CardSetsRepository } from '../card-sets/card-sets.repository';
import { CardsRepository } from '../cards/cards.repository';
import { Series, Set, SetResume, Card } from './external-data.interface';

@Injectable()
export class InitialCardSeedService implements OnApplicationBootstrap {
  constructor(
    private readonly cardRepository: CardsRepository,
    private readonly cardSetRepository: CardSetsRepository,
  ) {}
  tcgdex = new TCGdex('en');

  // runs this service after all modules are initialized but before rest of application loads
  async onApplicationBootstrap() {
    await this.seedCards();
  }

  async seedCards(): Promise<void> {
    try {
      const seriesData: Series = await this.tcgdex.fetch('series', 'tcgp');

      // fetch card set ids from pokemon tcg pocket
      const setIds: string[] = seriesData.sets.map((set) => set.id);

      // fetch all data related to the set and its cards
      const setsData: Set[] = await Promise.all(
        setIds.map((setId) => this.tcgdex.fetch('sets', setId)),
      );

      // flatten nested structure to abstract card ids and set ids
      const cardSetMapping: { setId: string; cardId: string }[] =
        setsData.flatMap((set) =>
          set.cards.map((card) => ({
            setId: set.id,
            cardId: card.localId,
          })),
        );

      const cardsList: Card<SetResume>[] = await Promise.all(
        cardSetMapping.map((cardSet) =>
          this.tcgdex.fetch('sets', cardSet.setId, cardSet.cardId),
        ),
      );

      await this.cardRepository.saveSeedCards(cardsList);
      await this.cardSetRepository.saveSeedSets(setsData);
    } catch (error) {
      console.log(`Service failed in seeding cards: ${error.message}`);
      throw new Error('Failed to seed cards in service');
    }
  }
}
