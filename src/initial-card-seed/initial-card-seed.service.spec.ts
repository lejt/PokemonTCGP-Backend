import { Test, TestingModule } from '@nestjs/testing';
import { InitialCardSeedService } from './initial-card-seed.service';
import { CardsRepository } from '../cards/cards.repository';
import { CardSetsRepository } from '../card-sets/card-sets.repository';

describe('InitialCardSeedService', () => {
  let service: InitialCardSeedService;
  let cardsRepository: jest.Mocked<CardsRepository>;
  let cardSetsRepository: jest.Mocked<CardSetsRepository>;

  // all mock data below are object structures returned from tcgdex sdk
  const mockCardSeries = {
    id: 'tcgp',
    name: 'Pokemon TCG Pocket',
    sets: [
      { id: 'A1', name: 'Set1Name' },
      { id: 'A2', name: 'Set2Name' },
    ],
  };
  const mockSets = {
    id: 'A1',
    name: 'Set1Name',
    serie: { id: 'tcgp', name: 'Pokemon TCG Pocket' },
    cards: [
      { id: 'A1-001', name: 'Bulbasaur' },
      { id: 'A1-002', name: 'Ivysaur' },
    ],
  };
  const mockCard = {
    id: 1,
    name: 'Pikachu',
    category: 'Pokemon',
    localId: '009',
    set: {
      cardCount: { official: 0, total: 33 },
      id: 'A1',
      name: 'Set1Name',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitialCardSeedService,
        {
          provide: CardsRepository,
          useValue: {
            saveSeedCards: jest.fn(),
          },
        },
        {
          provide: CardSetsRepository,
          useValue: {
            saveSeedSets: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InitialCardSeedService>(InitialCardSeedService);
    cardsRepository = module.get(CardsRepository);
    cardSetsRepository = module.get(CardSetsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call seedCards on application bootstrap', async () => {
    const spySeedCards = jest
      .spyOn(service, 'seedCards')
      .mockResolvedValue(undefined);
    await service.onApplicationBootstrap();
    expect(spySeedCards).toHaveBeenCalled();
  });

  it('should call the pokemon sdk and seed repositories', async () => {
    jest
      .spyOn(service.tcgdex, 'fetch')
      .mockImplementation((...args: any[]): Promise<any> => {
        const [endpoint, id1, id2] = args;

        if (endpoint === 'series' && id1) {
          return Promise.resolve(mockCardSeries);
        }
        if (endpoint === 'sets' && id1 && !id2) {
          return Promise.resolve(mockSets);
        }

        if (endpoint === 'sets' && id1 && id2) {
          return Promise.resolve(mockCard);
        }
        // default fallback for other endpoints
        return Promise.reject(new Error('Unexpected endpoint'));
      });

    // Call entire method
    await service.seedCards();

    const series = await service.tcgdex.fetch('series', 'tcgp');
    const sets = await service.tcgdex.fetch('sets', 'A1');
    const cards = await service.tcgdex.fetch('sets', 'A1', '1');

    expect(series).toBeDefined();
    expect(sets).toBeDefined();
    expect(cards).toBeDefined();

    const spySaveCardsToDB = jest.spyOn(cardsRepository, 'saveSeedCards');

    const spySaveSetsToDB = jest.spyOn(cardSetsRepository, 'saveSeedSets');

    expect(spySaveCardsToDB).toHaveBeenCalled();
    expect(spySaveSetsToDB).toHaveBeenCalled();
  });
});
