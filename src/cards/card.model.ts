export interface Card {
  id: string;
  name: string;
  description: Description[];
  attribute: string;
}

export interface Description {
  attack: number;
  cost: Energy[];
}

export enum Energy {
  GRASS = 'GRASS',
  FIRE = 'FIRE',
  WATER = 'WATER',
  LIGHTNING = 'LIGHTNING',
  PSYCHIC = 'PSYCHIC',
  FIGHTING = 'FIGHTING',
  DARKNESS = 'DARKNESS',
  METAL = 'METAL',
  FAIRY = 'FAIRY',
}
