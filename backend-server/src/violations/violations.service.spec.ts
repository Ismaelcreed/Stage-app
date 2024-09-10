import { Test, TestingModule } from '@nestjs/testing';
import { ViolationsService } from './violations.service';

describe('ViolationsService', () => {
  let service: ViolationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViolationsService],
    }).compile();

    service = module.get<ViolationsService>(ViolationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
