import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import TCGdex from '@tcgdex/sdk';
import { Series, Set, SetResume, Card } from './external-data.interface';
import { ERROR_MESSAGES } from '../constants/error-codes-and-messages';
import { CardSetsService } from 'src/card-sets/card-sets.service';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class InitialCardSeedService implements OnApplicationBootstrap {
  constructor(
    private readonly cardsService: CardsService,
    // private readonly cardRepository: CardsRepository,
    private readonly cardSetsService: CardSetsService,
    // private readonly cardSetRepository: CardSetsRepository,
  ) {}
  private readonly tcgdex = new TCGdex('en');
  private logger = new Logger('InitialCardSeedService');

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

      // TODO: replace with service call instead of repository call
      await this.cardsService.saveSeedCards(cardsList);
      // await this.cardRepository.saveSeedCards(cardsList);
      await this.cardSetsService.updateSeededSet(setsData);
      // await this.cardSetRepository.saveSeedSets(setsData);
    } catch (error) {
      this.logger.error(
        'Failed to fetch and seed cards, packs, and sets in service',
        error.stack,
      );
      throw new InternalServerErrorException(ERROR_MESSAGES.SEED_SAVE_FAILURE);
    }
  }
}
