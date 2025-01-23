import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Card } from './entity/card.entity';
import { chunk } from 'lodash';
import { CardSetsRepository } from '../card-sets/card-sets.repository';
import { PacksRepository } from '../packs/packs.repository';
import { ERROR_MESSAGES } from '../constants/error-codes-and-messages';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class CardsRepository extends Repository<Card> {
  constructor(
    private dataSource: DataSource,
    private readonly cardSetsRepository: CardSetsRepository,
    private readonly packsRepository: PacksRepository,
    private readonly usersRepository: UsersRepository,
  ) {
    super(Card, dataSource.createEntityManager());
  }
  private logger = new Logger('CardsRepository', { timestamp: true });

  async getCardIds(): Promise<number[]> {
    const cards = await this.find({ select: ['id'] });
    return cards.map((card) => card.id);
  }

  async saveSeedCards(cardsList: any): Promise<void> {
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
          const cardSet = await this.cardSetsRepository.findAndSaveSet(
            card.set,
          );
          // Check if the pack already exists
          const pack = await this.packsRepository.findAndSavePack(
            card,
            cardSet,
          );

          return this.create({
            name: card.name,
            image: card?.image,
            hp: card?.hp,
            types: card?.types,
            stage: card?.stage,
            rarity: card.rarity,
            suffix: card?.suffix,
            variants: card.variants,
            attacks: card?.attacks,
            retreat: card?.retreat,
            weakness: card?.weakness,
            category: card.category,
            illustrator: card.illustrator,
            description: card?.description,
            externalId: card.id,
            evolveFrom: card?.evolveFrom,
            effect: card?.effect,
            trainerType: card?.trainerType,
            cardSet,
            pack,
          });
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
