import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { Rarity, RarityChances } from './interfaces/card.enum';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly cardSetsService: CardSetsService,
    private readonly packsService: PacksService,
  ) {}
  private logger = new Logger('CardsService');

  async getAllCardIds(): Promise<number[]> {
    return this.cardsRepository.getCardIds();
  }

  async generateCards(cardSetExternalId: string, packId: number): Promise<any> {
    const isGeneticApex = cardSetExternalId === 'A1';
    const cardSet =
      await this.cardSetsService.findSetByExternalId(cardSetExternalId);
    let pack: Pack;

    // TODO: for future, might need an enum of all pack externalIds
    if (isGeneticApex) {
      pack = await this.packsService.findPackByCardSetId(cardSet, packId);
    }

    const cards = await this.cardsRepository.getCardsFromSetOrPack(
      cardSet,
      pack,
    );

    // randomizer algorithm
    // const randomCards = await this.cardDrawPoolRandomizer(cards);
    // const names = randomCards.map((card) => card.name);
    // console.log(names);
    return await this.cardDrawPoolRandomizer(cards);
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

  async saveSeedCards(cardsList: ExternalCard<SetResume>[]): Promise<void> {
    return this.cardsRepository.saveSeedCards(cardsList);
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
