import { Test, TestingModule } from '@nestjs/testing';
import { DriverResolver } from './driver.resolver';

describe('DriverResolver', () => {
  let resolver: DriverResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverResolver],
    }).compile();

    resolver = module.get<DriverResolver>(DriverResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
