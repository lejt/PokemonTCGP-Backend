export interface Set {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  serie: SerieResume;
  tcgOnline?: string;
  variants?: {
    normal?: boolean;
    reverse?: boolean;
    holo?: boolean;
    firstEdition?: boolean;
  };
  releaseDate: string;
  legal: {
    standard: boolean;
    expanded: boolean;
  };
  cardCount: {
    total: number;
    official: number;
    normal: number;
    reverse: number;
    holo: number;
    firstEd?: number;
  };
  cards: Array<CardResume>;
}

export interface SerieResume {
  id: string;
  name: string;
  logo?: string;
}

export interface CardResume {
  id: string;
  localId: string;
  name: string;
  image?: string;
}
