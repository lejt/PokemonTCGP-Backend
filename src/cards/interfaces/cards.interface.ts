import { Rarity } from './card.enum';

export type RarityChancesType = {
  [rarity in Rarity]?: number | { categoryChance: number; cardChance: number }; // For `fourthCard` & `fifthCard`
};

export interface CardSetRarityCounts {
  [cardSetName: string]: {
    diamondCount: number;
    starCount: number;
  };
}
