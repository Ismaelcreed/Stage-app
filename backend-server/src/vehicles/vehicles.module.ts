import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicles, VehiclesSchema } from './vehicles.schema';
import { VehiclesService } from './vehicles.service';
import { VehiclesResolver } from './vehicles.resolver';
import { DriverModule } from '../driver/driver.module';
import { Driver , DriverSchema } from 'src/driver/driver.schema';
import { ViolationsModule } from 'src/violations/violations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicles.name, schema: VehiclesSchema }]),
    MongooseModule.forFeature([{name : Driver.name , schema : DriverSchema}]),
    forwardRef(() => DriverModule),
    forwardRef(()=>ViolationsModule)
  ],
  providers: [VehiclesService, VehiclesResolver],
  exports: [VehiclesService],
})
export class VehiclesModule {}