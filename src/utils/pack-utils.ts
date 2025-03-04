import { PACK_CARD_IDS } from '../constants/pack-mapping';
import { PackNames } from '../packs/interfaces/pack.enum';

export const getPackName = (cardId: string): string => {
  let packName = '';
  const isGAPack = cardId.split('-')[0] === 'A1';
  const isSTSPack = cardId.split('-')[0] === 'A2';
  if (!isGAPack && !isSTSPack) return;

  if (isGAPack) {
    if (PACK_CARD_IDS['Genetic Apex']['Pikachu Pack'].includes(cardId)) {
      packName = PackNames.GENETIC_APEX_PACK_PIKACHU;
    } else if (
      PACK_CARD_IDS['Genetic Apex']['Charizard Pack'].includes(cardId)
    ) {
      packName = PackNames.GENETIC_APEX_PACK_CHARIZARD;
    } else if (PACK_CARD_IDS['Genetic Apex']['Mewtwo Pack'].includes(cardId)) {
      packName = PackNames.GENETIC_APEX_PACK_MEWTWO;
    }
  }

  if (isSTSPack) {
    if (PACK_CARD_IDS['Space Time Smackdown']['Dialga Pack'].includes(cardId)) {
      packName = PackNames.SPACE_TIME_SMACKDOWN_DIALGA;
    } else if (
      PACK_CARD_IDS['Space Time Smackdown']['Palkia Pack'].includes(cardId)
    ) {
      packName = PackNames.SPACE_TIME_SMACKDOWN_PALKIA;
    }
  }

  return packName;
};
