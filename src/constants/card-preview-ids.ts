import { CardSetNames } from 'src/card-sets/enum/cardSet.enum';

// TODO: might be better to add based on names since ids can change if re-seeded
export const cardPreviewIds = {
  [CardSetNames.GENETIC_APEX]: {
    Pikachu: [96, 41, 56, 104, 195, 78],
    Charizard: [36, 47, 76, 23, 146, 79],
    Mewtwo: [129, 4, 84, 153, 123, 132],
  },
  [CardSetNames.MYTHICAL_ISLAND]: { default: [322, 351, 365, 337, 378, 325] },
  [CardSetNames.SPACE_TIME_SMACKDOWN]: {
    Palkia: [587, 592, 602, 589, 603, 597],
    Dialga: [593, 585, 605, 596, 483],
  },
};
