// Following interfaces copied from TCGDex SDK as their models were not exposed
export interface SetResume {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount: {
    /**
     * total of number of cards
     */
    total: number;
    /**
     * number of cards officialy (on the bottom of each cards)
     */
    official: number;
  };
}

export interface Set {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  serie: SeriesResume;
  tcgOnline?: string;
  variants?: Variants;
  releaseDate: string;
  /**
   * Designate if the set is usable in tournaments
   *
   * Note: this is specific to the set and if a
   * card is banned from the set it will still be true
   */
  legal: {
    /**
     * Ability to play in standard tournaments
     */
    standard: boolean;
    /**
     * Ability to play in expanded tournaments
     */
    expanded: boolean;
  };
  cardCount: {
    /**
     * total of number of cards
     */
    total: number;
    /**
     * number of cards officialy (on the bottom of each cards)
     */
    official: number;
    /**
     * number of cards having a normal version
     */
    normal: number;
    /**
     * number of cards having an reverse version
     */
    reverse: number;
    /**
     * number of cards having an holo version
     */
    holo: number;
    /**
     * Number of possible cards
     */
    firstEd?: number;
  };
  cards: Array<CardResume>;
}

export interface Series extends SeriesResume {
  sets: SetList;
}

interface SeriesResume {
  id: string;
  name: string;
  logo?: string;
}

type SetList = Array<SetResume>;

interface CardResume {
  /**
   * Globally unique card ID based on the set ID and the cards ID within the set
   */
  id: string;
  /**
   * Card image url without the extension and quality
   *
   * @see {@link getImageURL}
   */
  image?: string;
  /**
   * ID indexing this card within its set, usually just its number
   */
  localId: string;
  /**
   * Card Name (Including the suffix if next to card name)
   */
  name: string;
}

interface Variants {
  normal?: boolean;
  reverse?: boolean;
  holo?: boolean;
  firstEdition?: boolean;
}

export type Endpoints =
  | 'cards'
  | 'categories'
  | 'dex-ids'
  | 'energy-types'
  | 'hp'
  | 'illustrators'
  | 'rarities'
  | 'regulation-marks'
  | 'retreats'
  | 'series'
  | 'sets'
  | 'stages'
  | 'suffixes'
  | 'trainer-types'
  | 'types'
  | 'variants'
  | 'random';

export interface Card<SetType extends SetResume = SetResume>
  extends CardResume {
  /**
   * Card illustrator
   */
  illustrator?: string;

  /**
   * Card Rarity
   *
   * - None https://www.tcgdex.net/database/sm/smp/SM01
   * - Common https://www.tcgdex.net/database/xy/xy9/1
   * - Uncommon https://www.tcgdex.net/database/xy/xy9/2
   * - Rare https://www.tcgdex.net/database/xy/xy9/3
   * - Ultra Rare
   * - Secret Rare
   */
  rarity: string;

  /**
   * Card Category
   *
   * - Pokemon
   * - Trainer
   * - Energy
   */
  category: string;

  /**
   * Card Variants (Override Set Variants)
   */
  variants?: Variants;

  /**
   * Card Set
   */
  set: SetType;

  /**
   * Pokemon only elements
   */

  /**
   * Pokemon Pokedex ID
   */
  dexId?: Array<number>;

  /**
   * Pokemon HP
   */
  hp?: number;

  /**
   * Pokemon Types
   * ex for multiple https://www.tcgdex.net/database/ex/ex13/17
   */
  types?: Array<string>;

  /**
   * Pokemon Sub Evolution
   */
  evolveFrom?: string;

  /**
   * Pokemon Weight
   */
  weight?: string;

  /**
   * Pokemon Description
   */
  description?: string;

  /**
   * Level of the Pokemon
   *
   * NOTE: can be equal to 'X' when the pokemon is a LEVEL-UP one
   */
  level?: number | string;

  /**
   * Pokemon Stage
   *
   * - Basic https://www.tcgdex.net/database/xy/xy9/1
   * - BREAK https://www.tcgdex.net/database/xy/xy9/18
   * - LEVEL-UP https://www.tcgdex.net/database/dp/dp1/121
   * - MEGA https://www.tcgdex.net/database/xy/xy1/2
   * - RESTORED https://www.tcgdex.net/database/bw/bw5/53
   * - Stage1 https://www.tcgdex.net/database/xy/xy9/2
   * - Stage2 https://www.tcgdex.net/database/xy/xy9/3
   * - VMAX https://www.tcgdex.net/database/swsh/swsh1/50
   */
  stage?: string;

  /**
   * Card Suffix
   *
   * - EX https://www.tcgdex.net/database/ex/ex2/94
   * - GX https://www.tcgdex.net/database/sm/sm12/4
   * - V https://www.tcgdex.net/database/swsh/swsh1/1
   * - Legend https://www.tcgdex.net/database/hgss/hgss1/114
   * - Prime https://www.tcgdex.net/database/hgss/hgss2/85
   * - SP https://www.tcgdex.net/database/pl/pl1/7
   * - TAG TEAM-GX https://www.tcgdex.net/database/sm/sm12/226
   */
  suffix?: string;

  /**
   * Pokemon Held Item
   *
   * ex https://www.tcgdex.net/database/dp/dp2/75
   */
  item?: {
    name: string;
    effect: string;
  };

  /**
   * Pokemon Abilities
   *
   * multi abilities ex https://www.tcgdex.net/database/ex/ex15/10
   */
  abilities?: Array<{
    type: string;
    name: string;
    effect: string;
  }>;

  /**
   * Pokemon Attacks
   */
  attacks?: Array<{
    cost?: Array<string>;
    name: string;
    effect?: string;
    damage?: string | number;
  }>;

  /**
   * Pokemon Weaknesses
   */
  weaknesses?: Array<{
    type: string;
    value?: string;
  }>;

  resistances?: Array<{
    type: string;
    value?: string;
  }>;

  retreat?: number;

  // Trainer/Energy
  effect?: string;

  // Trainer Only
  trainerType?: string;

  // Energy Only
  energyType?: string;

  /**
   * Define the rotation mark on cards >= Sword & Shield
   */
  regulationMark?: string;

  /**
   * Card ability to be played in official tournaments
   *
   * Note: all cards are avaialable to play in unlimited tournaments
   */
  legal: {
    /**
     * Ability to play in standard tournaments
     */
    standard: boolean;

    /**
     * Ability to play in expanded tournaments
     */
    expanded: boolean;
  };
}
