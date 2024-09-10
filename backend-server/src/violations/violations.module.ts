import { Module , forwardRef} from '@nestjs/common';
import { ViolationsResolver } from './violations.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ViolationsService } from './violations.service';
import { Violations , ViolationsSchema } from './violations.schema';

import { DriverModule } from 'src/driver/driver.module';
import {Driver , DriverSchema} from '../driver/driver.schema';

import { VehiclesModule } from 'src/vehicles/vehicles.module';
import { Vehicles , VehiclesSchema } from 'src/vehicles/vehicles.schema';

import { PoliceModule } from 'src/police/police.module';
import {Police, PoliceSchema} from '../police/police.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([{name : Violations.name , schema : ViolationsSchema}]),

    MongooseModule.forFeature([{name : Driver.name , schema : DriverSchema}]),
    forwardRef(() => DriverModule),

    MongooseModule.forFeature([{name : Vehicles.name , schema : VehiclesSchema}]),
    forwardRef(()=>VehiclesModule),
  
    MongooseModule.forFeature([{name : Police.name , schema : PoliceSchema}]),
    forwardRef(()=>PoliceModule)],


  providers: [ViolationsResolver, ViolationsService]
})
export class ViolationsModule {}
