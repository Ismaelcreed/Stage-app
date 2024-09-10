import { Module } from '@nestjs/common';
import { QRCodeService } from './qrcode.service';
import { QRCodeController } from './qrcode.controller';

@Module({
  controllers: [QRCodeController],
  providers: [QRCodeService],
})
export class QRCodeModule {}
