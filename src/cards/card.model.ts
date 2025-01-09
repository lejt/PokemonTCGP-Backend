export type Description = ActionDescription[];
interface ActionDescription {
  action: string;
  cost: ActionCost[];
}

interface ActionCost {
  attribute: Energy;
  quantity: number;
}

export enum Energy {
  GRASS = 'grass',
  FIRE = 'fire',
  WATER = 'water',
  LIGHTNING = 'lightning',
  PSYCHIC = 'psychic',
  FIGHTING = 'fighting',
  DARKNESS = 'darkness',
  METAL = 'metal',
  FAIRY = 'fairy',
}

export enum CardSet {
  GENETIC_APEX = 'A1',
  MYTHICAL_ISLAND = 'A1a',
  PROMOS_A = 'P-A',
}
