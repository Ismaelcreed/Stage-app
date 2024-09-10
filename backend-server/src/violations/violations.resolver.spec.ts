import { Test, TestingModule } from '@nestjs/testing';
import { ViolationsResolver } from './violations.resolver';

describe('ViolationsResolver', () => {
  let resolver: ViolationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViolationsResolver],
    }).compile();

    resolver = module.get<ViolationsResolver>(ViolationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
