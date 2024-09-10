import { Test, TestingModule } from '@nestjs/testing';
import { PoliceResolver } from './police.resolver';

describe('PoliceResolver', () => {
  let resolver: PoliceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoliceResolver],
    }).compile();

    resolver = module.get<PoliceResolver>(PoliceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
