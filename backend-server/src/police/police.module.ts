import { Module ,forwardRef} from '@nestjs/common';
import { PoliceResolver } from './police.resolver';
import { PoliceService } from './police.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Police, PoliceSchema } from './police.schema';
import { ViolationsModule } from 'src/violations/violations.module';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Police.name , schema : PoliceSchema}]),
    forwardRef(() => ViolationsModule),
  ],
  providers: [PoliceResolver, PoliceService]
})

export class PoliceModule {}
