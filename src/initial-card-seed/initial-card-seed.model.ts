export interface Set {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  serie: SeriesResume;
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

export interface CardResume {
  id: string;
  localId: string;
  name: string;
  image?: string;
}

export interface SeriesResume {
  id: string;
  name: string;
  logo?: string;
}

export interface Series {
  id: string;
  name: string;
  logo?: string;
  sets: BriefSet[];
}

export interface BriefSet {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount: {
    total: number;
    official: number;
  };
}
