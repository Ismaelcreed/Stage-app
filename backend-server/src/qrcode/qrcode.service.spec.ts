import { Test, TestingModule } from '@nestjs/testing';
import { QRCodeService } from './qrcode.service';

describe('QRCodeService', () => {
  let service: QRCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QRCodeService],
    }).compile();

    service = module.get<QRCodeService>(QRCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
