import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Card } from './entity/card.entity';
import { chunk } from 'lodash';
import { ERROR_MESSAGES } from '../constants/error-codes-and-messages';
import { CardSetsService } from '../card-sets/card-sets.service';
import { PacksService } from '../packs/packs.service';
import {
  Card as ExternalCard,
  SetResume,
} from '../initial-card-seed/interface/external-data.interface';
import { CardSet } from '../card-sets/entity/card-set.entity';
import { Pack } from '../packs/entity/pack.entity';
import { plainToInstance } from 'class-transformer';
import { SimpleCard } from './dto/simple-card.dto';

@Injectable()
export class CardsRepository extends Repository<Card> {
  constructor(
    private dataSource: DataSource,
    private readonly cardSetsService: CardSetsService,
    private readonly packsService: PacksService,
  ) {
    super(Card, dataSource.createEntityManager());
  }
  private logger = new Logger('CardsRepository', { timestamp: true });

  async getCardsFromSetOrPack(cardSet: CardSet, pack: Pack): Promise<any> {
    let cards: Card[];
    if (pack) {
      cards = await this.find({ where: { pack: { id: pack.id } } });
    } else {
      cards = await this.find({
        where: { cardSet: { id: cardSet.id } },
      });
    }

    return plainToInstance(SimpleCard, cards, {
      excludeExtraneousValues: true,
    });
  }

  async saveSeedCards(cardsList: ExternalCard<SetResume>[]): Promise<void> {
    this.logger.log('Starting the card, set, and pack seeding process...');
    try {
      this.logger.log(`Received ${cardsList.length} cards for processing.`);
      // check for dups before creating/saving
      const existingCards = await this.find({
        select: ['externalId'],
      });
      const existingCardIds = existingCards.map((card) => card.externalId);
      this.logger.log(
        `${existingCardIds.length} existing cards found in the database.`,
      );

      const mappedCards = cardsList
        .filter((card) => {
          return !existingCardIds.includes(card.id);
        })
        .map(async (card) => {
          // Check if the cardSet already exists
          const cardSet = await this.cardSetsService.findAndSaveSet(card.set);
          // Check if the pack already exists
          const pack = await this.packsService.findAndSavePack(card, cardSet);

          return this.create({
            name: card.name,
            image: card?.image,
            hp: card?.hp,
            types: card?.types,
            stage: card?.stage,
            rarity: card.rarity,
            suffix: card?.suffix,
            attacks: card?.attacks,
            retreat: card?.retreat,
            weakness: card?.weaknesses,
            category: card.category,
            illustrator: card.illustrator,
            description: card?.description || '',
            externalId: card.id,
            evolveFrom: card?.evolveFrom,
            effect: card?.effect,
            trainerType: card?.trainerType,
            cardSet,
            pack,
          } as Card);
        });

      // Wait for all card processing to complete
      const resolvedCards = await Promise.all(mappedCards);
      if (!resolvedCards.length) return;

      this.logger.log(`${resolvedCards.length} new cards to save.`);

      // Chunk save for performance as potential large dataset
      const chunks = chunk(resolvedCards, 100);
      for (const [index, batch] of chunks.entries()) {
        try {
          this.logger.log(`Saving batch ${index + 1} of ${chunks.length}...`);
          await this.save(batch);
          this.logger.log(`Batch ${index + 1} saved successfully.`);
        } catch (error) {
          this.logger.debug(
            `Error saving batch ${index + 1} of ${chunks.length}, batch: ${batch}`,
            error.stack,
          );
          throw new InternalServerErrorException(
            ERROR_MESSAGES.SEED_SAVE_FAILURE,
          );
        }
      }
      this.logger.log('Card, Set, and Pack data seeded succesfully');
    } catch (error) {
      this.logger.error(
        'Failed to seed cards, sets, and packs into database',
        error.stack,
      );
      throw new InternalServerErrorException(ERROR_MESSAGES.SEED_SAVE_FAILURE);
    }
  }
}
