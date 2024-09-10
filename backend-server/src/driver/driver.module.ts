import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './driver.schema';
import { DriverService } from './driver.service';
import { DriverResolver } from './driver.resolver';
import { VehiclesModule } from 'src/vehicles/vehicles.module';
import { ViolationsModule } from 'src/violations/violations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    forwardRef(() => VehiclesModule),
    forwardRef(() => ViolationsModule),

  ],
  providers: [DriverService, DriverResolver],
  exports: [DriverService],
})
export class DriverModule {}