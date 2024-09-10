import { Controller, Get, Query } from '@nestjs/common';
import { QRCodeService } from './qrcode.service';

@Controller('qrcode')
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @Get()
  async generateQRCode(@Query('text') text: string): Promise<{ qrCodeUrl: string }> {
    const qrCodeUrl = await this.qrCodeService.generateQRCode(text);
    return { qrCodeUrl };
  }
}
