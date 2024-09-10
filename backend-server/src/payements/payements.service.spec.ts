import { Test, TestingModule } from '@nestjs/testing';
import { PayementsService } from './payements.service';

describe('PayementsService', () => {
  let service: PayementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayementsService],
    }).compile();

    service = module.get<PayementsService>(PayementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
