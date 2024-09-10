import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ViolationsService } from './violations.service';
import { Violations } from './violations.schema';

@Resolver(() => Violations)
export class ViolationsResolver {
  constructor(private readonly violationsService: ViolationsService) {}

  @Query(() => [Violations])
  async violations(): Promise<Violations[]> {
    return this.violationsService.findAll();
  }

  @Query(() => Violations, { nullable: true })
  async violation(@Args('id_violations') id_violations: string): Promise<Violations | null> {
    return this.violationsService.findOne(id_violations);
  }

  @Mutation(() => Violations)
  async createViolation(
    @Args('id_violations') id_violations: string,
    @Args('driver_id') driver_id: string,
    @Args('officer_id') officer_id: string,
    @Args('vehicle_id') vehicle_id: string,
    @Args('violation_type') violation_type: string,
    @Args('desc') desc: string,
    @Args('date') date: Date,
    @Args('localisation') localisation: string,
  ): Promise<Violations> {
    const formattedDate = new Date(date);

    const driver = await this.violationsService.findDriverById(driver_id);
    const officer = await this.violationsService.findOfficerById(officer_id);
    const vehicle = await this.violationsService.findVehicleById(vehicle_id);

    if (!driver) {
      throw new Error(`Driver with ID ${driver_id} not found`);
    }
    if (!officer) {
      throw new Error(`Officer with ID ${officer_id} not found`);
    }
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicle_id} not found`);
    }

    return this.violationsService.create({
      id_violations,
      driver_id,
      officer_id,
      vehicle_id,
      violation_type,
      desc,
      date: formattedDate,
      localisation,
    });
  }

  @Mutation(() => Violations, { nullable: true })
  async updateViolation(
    @Args('id_violations') id_violations: string,
    @Args('driver_id') driver_id: string,
    @Args('officer_id') officer_id: string,
    @Args('vehicle_id') vehicle_id: string,
    @Args('violation_type') violation_type: string,
    @Args('desc') desc: string,
    @Args('date') date: string,
    @Args('localisation') localisation: string,
  ): Promise<Violations | null> {
    const formattedDate = new Date(date);

  
    const driver = await this.violationsService.findDriverById(driver_id);
    const officer = await this.violationsService.findOfficerById(officer_id);
    const vehicle = await this.violationsService.findVehicleById(vehicle_id);

    if (!driver) {
      throw new Error(`Driver with ID ${driver_id} not found`);
    }
    if (!officer) {
      throw new Error(`Officer with ID ${officer_id} not found`);
    }
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicle_id} not found`);
    }

    return this.violationsService.update(id_violations, {
      id_violations,
      driver_id,
      officer_id,
      vehicle_id,
      violation_type,
      desc,
      date: formattedDate,
      localisation,
    });
  }

  @Mutation(() => Violations, { nullable: true })
  async deleteViolation(@Args('id_violations') id_violations: string): Promise<Violations | null> {
    return this.violationsService.delete(id_violations);
  }
}
