export enum Energy {
  GRASS = 'Grass',
  FIRE = 'Fire',
  WATER = 'Water',
  LIGHTNING = 'Lightning',
  PSYCHIC = 'Psychic',
  FIGHTING = 'Fighting',
  DARKNESS = 'Darkness',
  METAL = 'Metal',
  FAIRY = 'Fairy',
  COLORLESS = 'Colorless',
}

export enum CardSet {
  GENETIC_APEX = 'A1',
  MYTHICAL_ISLAND = 'A1a',
  PROMOS_A = 'P-A',
}

export enum CardNameSuffix {
  EX = 'EX',
}

export enum Rarity {
  ONE_DIAMOND = 'One Diamond',
  TWO_DIAMOND = 'Two Diamond',
  THREE_DIAMOND = 'Three Diamond',
  FOUR_DIAMOND = 'Four Diamond',
  ONE_STAR = 'One Star',
  TWO_STAR = 'Two Star',
  THREE_STAR = 'Three Star',
  CROWN = 'Crown',
  NONE = 'None',
}

export const RarityOrder: { [key in Rarity]: number } = {
  [Rarity.ONE_DIAMOND]: 0,
  [Rarity.TWO_DIAMOND]: 1,
  [Rarity.THREE_DIAMOND]: 2,
  [Rarity.FOUR_DIAMOND]: 3,
  [Rarity.ONE_STAR]: 4,
  [Rarity.TWO_STAR]: 5,
  [Rarity.THREE_STAR]: 6,
  [Rarity.CROWN]: 7,
  [Rarity.NONE]: 8, // Always last
};

export const diamondRarities = [
  Rarity.ONE_DIAMOND,
  Rarity.TWO_DIAMOND,
  Rarity.THREE_DIAMOND,
  Rarity.FOUR_DIAMOND,
];

export const starRarities = [
  Rarity.ONE_STAR,
  Rarity.TWO_STAR,
  Rarity.THREE_STAR,
];

export const RarityChances = {
  firstThreeCards: {
    [Rarity.ONE_DIAMOND]: 2 / 100,
  },
  fourthCard: {
    [Rarity.TWO_DIAMOND]: {
      categoryChance: 90 / 100,
      cardChance: 2.571 / 100,
    },
    [Rarity.THREE_DIAMOND]: {
      categoryChance: 5 / 100,
      cardChance: 0.357 / 100,
    },
    [Rarity.FOUR_DIAMOND]: {
      categoryChance: 1.666 / 100,
      cardChance: 0.333 / 100,
    },
    [Rarity.ONE_STAR]: {
      categoryChance: 2.572 / 100,
      cardChance: 0.321 / 100,
    },
    [Rarity.TWO_STAR]: {
      categoryChance: 0.5 / 100,
      cardChance: 0.055 / 100,
    },
    [Rarity.THREE_STAR]: {
      categoryChance: 0.222 / 100,
      cardChance: 0.222 / 100,
    },
    [Rarity.CROWN]: { categoryChance: 0.04 / 100, cardChance: 0.013 / 100 },
  },
  fifthCard: {
    [Rarity.TWO_DIAMOND]: {
      categoryChance: 60 / 100,
      cardChance: 1.714 / 100,
    },
    [Rarity.THREE_DIAMOND]: {
      categoryChance: 20 / 100,
      cardChance: 1.428 / 100,
    },
    [Rarity.FOUR_DIAMOND]: {
      categoryChance: 6.664 / 100,
      cardChance: 1.332 / 100,
    },
    [Rarity.ONE_STAR]: {
      categoryChance: 10.288 / 100,
      cardChance: 1.286 / 100,
    },
    [Rarity.TWO_STAR]: {
      categoryChance: 2 / 100,
      cardChance: 0.222 / 100,
    },
    [Rarity.THREE_STAR]: {
      categoryChance: 0.888 / 100,
      cardChance: 0.888 / 100,
    },
    [Rarity.CROWN]: { categoryChance: 0.16 / 100, cardChance: 0.053 / 100 },
  },
};

export const EnergyOrder: { [key in Energy]: number } = {
  [Energy.GRASS]: 0,
  [Energy.FIRE]: 1,
  [Energy.WATER]: 2,
  [Energy.LIGHTNING]: 3,
  [Energy.PSYCHIC]: 4,
  [Energy.FIGHTING]: 5,
  [Energy.DARKNESS]: 6,
  [Energy.METAL]: 7,
  [Energy.FAIRY]: 8,
  [Energy.COLORLESS]: 9,
};

export enum Stage {
  BASIC = 'Basic',
  STAGE_1 = 'Stage1',
  STAGE_2 = 'Stage2',
}

export enum Category {
  POKEMON = 'Pokemon',
  TRAINER = 'Trainer',
}

export enum TrainerType {
  ITEM = 'Item',
  SUPPORTER = 'Supporter',
}
