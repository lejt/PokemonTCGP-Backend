import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { Card } from './entity/card.entity';
import { In } from 'typeorm';
import { ERROR_MESSAGES } from '../constants/error-codes-and-messages';
import { CardSetsService } from '../card-sets/card-sets.service';
import {
  SetResume,
  Card as ExternalCard,
} from '../initial-card-seed/external-data.interface';
import { PacksService } from '../packs/packs.service';
import { Pack } from '../packs/entity/pack.entity';
import {
  diamondRarities,
  Rarity,
  RarityChances,
  starRarities,
} from './interfaces/card.enum';
import { UsersService } from '../users/users.service';
import { UserCardsService } from '../user-cards/user-cards.service';
import { CardSetRarityCounts } from './interfaces/cardset-card-rarity-count.interface';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly cardSetsService: CardSetsService,
    private readonly packsService: PacksService,
    private readonly usersService: UsersService,
    private readonly userCardsService: UserCardsService,
  ) {}
  private logger = new Logger('CardsService');

  async getAllCards(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    // TODO: put into interface
    data: Card[];
    pagination: {
      currentPage: number;
      nextPage: number;
      totalItems: number;
      totalPages: number;
      limit: number;
    };
  }> {
    page = isNaN(page) || page < 1 ? 1 : page;
    limit = isNaN(limit) || limit < 1 ? 10 : limit;

    const skip = (page - 1) * limit;

    try {
      const [cards, total] = await this.cardsRepository.findAndCount({
        skip,
        take: limit,
        order: {
          id: 'ASC',
        },
      });

      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;

      return {
        data: cards,
        pagination: {
          currentPage: page,
          nextPage: nextPage,
          totalItems: total,
          totalPages: totalPages,
          limit: limit,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error occurred when fetch cards with query: {page: ${page}, limit: ${limit}}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        ERROR_MESSAGES.GENERIC_FETCHING_ERROR,
      );
    }
  }

  async findCardById(cardId: number): Promise<Card | null> {
    return this.cardsRepository.findOneBy({ id: cardId });
  }

  async findCardsByIds(cardIds: number[]): Promise<Card[] | null> {
    if (!cardIds.length) return null;

    // fetch unique card Ids, typeORM .find only performs unique searches
    const uniqueCardIds = Array.from(new Set(cardIds));
    const cards = await this.cardsRepository.findBy({ id: In(uniqueCardIds) });

    // Map original cardIds to match the duplicate records as needed
    const cardMap = new Map(cards.map((card) => [card.id, card]));
    const result = cardIds.map((id) => {
      const card = cardMap.get(id);
      if (!card) {
        this.logger.warn(`Card id: ${card.id} not found`);
        throw new NotFoundException(ERROR_MESSAGES.CARD_NOT_FOUND);
      }
      return card;
    });

    return result;
  }

  async generateCards(
    cardSetExternalId: string,
    packId: number,
    userId: string,
  ): Promise<any> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      this.logger.error(
        `User with id: ${userId} not found in card adding process`,
      );
    }
    const cardSet =
      await this.cardSetsService.findSetByExternalId(cardSetExternalId);
    if (!cardSet) {
      this.logger.warn(
        `CardSet with externalId: ${cardSetExternalId} not found in card adding process`,
      );
    }
    let pack: Pack;

    // TODO: for future, might need an enum of all pack externalIds
    const isGeneticApex = cardSetExternalId === 'A1';
    if (isGeneticApex) {
      pack = await this.packsService.findPackByCardSetId(cardSet, packId);
      if (!pack) {
        this.logger.warn(
          `Pack with id: ${packId} not found in card adding process`,
        );
      }
    }

    const cards = await this.cardsRepository.getCardsFromSetOrPack(
      cardSet,
      pack,
    );

    try {
      // randomizer algorithm
      const randomizedCards = await this.cardDrawPoolRandomizer(cards);

      // save cards to user
      this.userCardsService.addMultipleUserCards(user, randomizedCards);
      return randomizedCards;
    } catch (error) {
      this.logger.error(`Failed to generate and save cards`, error.stack);
      throw new InternalServerErrorException(
        ERROR_MESSAGES.CARD_GENERATION_AND_SAVE_FAILED,
      );
    }
  }

  async saveSeedCards(cardsList: ExternalCard<SetResume>[]): Promise<void> {
    return this.cardsRepository.saveSeedCards(cardsList);
  }

  async getCardRarityCountPerCardSet(): Promise<CardSetRarityCounts> {
    try {
      this.logger.log('Fetching cards and counting by rarities...');

      const cards = await this.cardsRepository.find();
      const cardSets = await this.cardSetsService.getAllCardSets();
      const cardSetRarityCounts: CardSetRarityCounts = {};

      cardSets.forEach((cs) => {
        cardSetRarityCounts[cs.name] = { diamondCount: 0, starCount: 0 };
      });

      cards.forEach((card) => {
        const cardSetName = card.cardSet.name;
        if (!cardSetRarityCounts[cardSetName]) {
          cardSetRarityCounts[cardSetName] = { diamondCount: 0, starCount: 0 };
        }

        if (diamondRarities.includes(card.rarity)) {
          cardSetRarityCounts[cardSetName].diamondCount++;
        } else if (starRarities.includes(card.rarity)) {
          cardSetRarityCounts[cardSetName].starCount++;
        }
      });

      this.logger.log('Successfully counted rarities of cards per card set');
      return cardSetRarityCounts;
    } catch (error) {
      this.logger.error(
        'Error while counting card rarities per card set',
        error.stack,
      );
      throw new InternalServerErrorException(
        ERROR_MESSAGES.GENERIC_FETCHING_ERROR,
      );
    }
  }

  async cardDrawPoolRandomizer(cards: any): Promise<any> {
    // Categorize cards by rarity
    const pools = {
      [Rarity.ONE_DIAMOND]: cards.filter(
        (card) => card.rarity === Rarity.ONE_DIAMOND,
      ),
      [Rarity.TWO_DIAMOND]: cards.filter(
        (card) => card.rarity === Rarity.TWO_DIAMOND,
      ),
      [Rarity.THREE_DIAMOND]: cards.filter(
        (card) => card.rarity === Rarity.THREE_DIAMOND,
      ),
      [Rarity.FOUR_DIAMOND]: cards.filter(
        (card) => card.rarity === Rarity.FOUR_DIAMOND,
      ),
      [Rarity.ONE_STAR]: cards.filter(
        (card) => card.rarity === Rarity.ONE_STAR,
      ),
      [Rarity.TWO_STAR]: cards.filter(
        (card) => card.rarity === Rarity.TWO_STAR,
      ),
      [Rarity.THREE_STAR]: cards.filter(
        (card) => card.rarity === Rarity.THREE_STAR,
      ),
      [Rarity.CROWN]: cards.filter((card) => card.rarity === Rarity.CROWN),
    };

    const selectedCards = [];

    // Draw the first three cards
    for (let i = 0; i < 3; i++) {
      selectedCards.push(
        this.drawCardFromPool(pools[Rarity.ONE_DIAMOND], 0.02),
      );
    }

    // Draw the fourth card
    selectedCards.push(
      this.drawCardWithCategory(pools, RarityChances.fourthCard),
    );

    // Draw the fifth card
    selectedCards.push(
      this.drawCardWithCategory(pools, RarityChances.fifthCard),
    );

    return selectedCards;
  }

  // Helper function to draw a card from a pool based on card-specific probabilities
  drawCardFromPool = (pool: any[], cardChance: number): any => {
    const random = Math.random();
    const index = Math.floor(random / cardChance);
    return pool[index % pool.length]; // Fallback to valid index
  };

  // Helper function to handle category-based draw logic
  drawCardWithCategory = (pools: Record<string, any[]>, chances: any): any => {
    const random = Math.random();
    let cumulativeChance = 0;

    for (const rarity in chances) {
      const categoryChance = chances[rarity].categoryChance;
      cumulativeChance += categoryChance;

      if (random <= cumulativeChance) {
        // Draw a card from the selected category
        return this.drawCardFromPool(pools[rarity], chances[rarity].cardChance);
      }
    }

    return null; // In case no card is selected (unlikely with proper probabilities)
  };
}
