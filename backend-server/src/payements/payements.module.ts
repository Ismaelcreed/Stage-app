import { Module } from '@nestjs/common';
import { PayementsService } from './payements.service';
import { PayementsResolver } from './payements.resolver';

@Module({
  providers: [PayementsService, PayementsResolver]
})
export class PayementsModule {}
