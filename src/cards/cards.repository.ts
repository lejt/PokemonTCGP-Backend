import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Card } from './card.entity';
import { chunk } from 'lodash';
import { CardSetsRepository } from '../card-sets/card-sets.repository';
import { Category } from './card.enum';
import { PacksRepository } from '../packs/packs.repository';

@Injectable()
export class CardsRepository extends Repository<Card> {
  constructor(
    private dataSource: DataSource,
    // @InjectRepository(CardSetRepository)
    private readonly cardSetsRepository: CardSetsRepository,
    // @InjectRepository(PackRepository)
    private readonly packsRepository: PacksRepository,
  ) {
    super(Card, dataSource.createEntityManager());
  }

  // TODO: make more generic for all cards
  async getCards(): Promise<Card[]> {
    const cards = await this.find({
      where: {
        category: Category.POKEMON,
      },
    });

    return cards;
  }

  async saveSeedCards(cardsList: any): Promise<void> {
    try {
      // check for dups before creating/saving
      const existingCards = await this.find({
        select: ['externalId'],
      });
      const existingCardIds = existingCards.map((card) => card.externalId);

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

      await console.log('Seeding cards initialized...');

      // Chunk save for performance as potential large dataset
      const chunks = chunk(resolvedCards, 100);
      for (const [index, batch] of chunks.entries()) {
        try {
          console.log(`Saving batch ${index + 1} of ${chunks.length}...`);
          await this.save(batch);
          console.log(`Batch ${index + 1} saved successfully.`);
        } catch (error) {
          console.error(`Error saving batch ${index + 1}:`, error.message);
        }
      }

      await console.log('Card and Set data seeded succesfully.');
    } catch (error) {
      console.log(`Error seeding cards in database: ${error.message}`);
      throw new Error('Failed to seed cards in database');
    }
  }
}
