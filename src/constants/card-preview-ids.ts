import { CardSetNames } from 'src/card-sets/enum/cardSet.enum';

// TODO: might be better to add based on names since ids can change if re-seeded
export const cardPreviewExternalIds = {
  [CardSetNames.GENETIC_APEX]: {
    Pikachu: ['A1-281', 'A1-276', 'A1-233', 'A1-041', 'A1-056', 'A1-250'],
    Charizard: ['A1-036', 'A1-230', 'A1-234', 'A1-020', 'A1-236', 'A1-272'],
    Mewtwo: ['A1-282', 'A1-004', 'A1-277', 'A1-084', 'A1-244', 'A1-210'],
  },
  [CardSetNames.MYTHICAL_ISLAND]: {
    default: ['A1a-085', 'A1a-072', 'A1a-073', 'A1a-070', 'A1a-026', 'A1a-014'],
  },
  [CardSetNames.SPACE_TIME_SMACKDOWN]: {
    Palkia: ['A2-204', 'A2-167', 'A2-190', 'A2-162', 'A2-125', 'A2-037'],
    Dialga: ['A2-205', 'A2-160', 'A2-179', 'A2-007', 'A2-095'],
  },
};
