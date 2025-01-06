import { Test, TestingModule } from '@nestjs/testing';
import { InitialCardSeedService } from './initial-card-seed.service';

describe('InitialCardSeedService', () => {
  let service: InitialCardSeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitialCardSeedService],
    }).compile();

    service = module.get<InitialCardSeedService>(InitialCardSeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
