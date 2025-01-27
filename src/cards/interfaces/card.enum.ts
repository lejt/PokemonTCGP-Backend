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
