import { Resolver, Query } from '@nestjs/graphql';
import { PoliceService } from './police/police.service';
import { DriverService } from './driver/driver.service';
import { VehiclesService } from './vehicles/vehicles.service';
import { ViolationsService } from './violations/violations.service';
import { StatsType } from './stats.type'; 
import { StatsService } from './stats.service';
import { MonthlyInfraction } from './stats.type';

@Resolver(() => StatsType)
export class StatsResolver {
  constructor(
    private readonly agentsService: PoliceService,
    private readonly conducteursService: DriverService,
    private readonly vehiculesService: VehiclesService,
    private readonly violationsService: ViolationsService,
    private readonly statService: StatsService,
  ) {}

  @Query(() => StatsType)
  async getStats() {
    const totalAgents = await this.agentsService.count();
    const totalConducteurs = await this.conducteursService.count();
    const totalVehicules = await this.vehiculesService.count();
    const totalViolations = await this.violationsService.count();

    const excessSpeed = await this.statService.countExcessSpeedInfractions();
    const drivingUnderInfluence = await this.statService.countDrivingUnderInfluenceInfractions();
    const illegalParking = await this.statService.countIllegalParkingInfractions();
    const signalViolation = await this.statService.countSignalViolationInfractions();
    const specificInfractions = await this.statService.countSpecificInfractions();
    const vehicleRelatedInfractions = await this.statService.countVehicleRelatedInfractions();


    return {
      totalAgents,
      totalConducteurs,
      totalVehicules,
      totalViolations,

      excessSpeed,
      illegalParking,
      signalViolation,
      drivingUnderInfluence,
      specificInfractions,
      vehicleRelatedInfractions,
    };
  }

  @Query(() => [MonthlyInfraction])
  async getMonthlyInfractions(): Promise<MonthlyInfraction[]> {
    return this.statService.getMonthlyInfractions();
  }
}
