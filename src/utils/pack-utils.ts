import { PACK_CARD_IDS } from '../constants/pack-mapping';
import { PackNames } from '../packs/interfaces/pack.enum';

export const isGeneticApexPack = (cardId: string): boolean =>
  cardId.split('-')[0] === 'A1';

export const getGAPackName = (cardId: string): string => {
  let packName = '';
  const isGAPack = isGeneticApexPack(cardId);
  if (!isGAPack) return;

  if (PACK_CARD_IDS['Genetic Apex']['Pikachu Pack'].includes(cardId)) {
    packName = PackNames.GENETIC_APEX_PACK_PIKACHU;
  } else if (PACK_CARD_IDS['Genetic Apex']['Charizard Pack'].includes(cardId)) {
    packName = PackNames.GENETIC_APEX_PACK_CHARIZARD;
  } else {
    packName = PackNames.GENETIC_APEX_PACK_MEWTWO;
  }
  return packName;
};
