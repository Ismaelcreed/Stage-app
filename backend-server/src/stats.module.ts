// src/stats/stats.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsService } from './stats.service';
import { Police, PoliceSchema } from './police/police.schema';
import { Driver, DriverSchema } from './driver/driver.schema';
import { Vehicles, VehiclesSchema } from './vehicles/vehicles.schema';
import { Violations, ViolationsSchema } from './violations/violations.schema';
import { PoliceService } from './police/police.service';
import { DriverService } from './driver/driver.service';
import { VehiclesService } from './vehicles/vehicles.service';
import { ViolationsService } from './violations/violations.service';
import { StatsResolver } from './stat.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Police.name, schema: PoliceSchema }]),
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    MongooseModule.forFeature([{ name: Vehicles.name, schema: VehiclesSchema }]),
    MongooseModule.forFeature([{ name: Violations.name, schema: ViolationsSchema }]),
  ],
  providers: [  PoliceService,
    DriverService,
    VehiclesService,
    ViolationsService,
    StatsResolver,
    StatsService],
  exports: [StatsService],
})
export class StatsModule {}
