import { Test, TestingModule } from '@nestjs/testing';
import { PoliceService } from './police.service';

describe('PoliceService', () => {
  let service: PoliceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoliceService],
    }).compile();

    service = module.get<PoliceService>(PoliceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
