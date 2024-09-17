import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
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
    @Args({ name: 'violation_type', type: () => [String] }) violation_type: string[], 
    @Args('desc') desc: string,
    @Args('date') date: Date,
    @Args('localisation') localisation: string,
    @Args('amende', { type: () => Float }) amende: number // Corrigé
  ): Promise<Violations> {
    const formattedDate = new Date(date);

    // Create the violation with the provided data
    const violation = await this.violationsService.create({
      id_violations,
      driver_id,
      officer_id,
      vehicle_id,
      violation_type,
      desc,
      date: formattedDate,
      localisation,
      amende
    });

    return violation;
  }

  @Mutation(() => Violations, { nullable: true })
  async updateViolation(
    @Args('id_violations') id_violations: string,
    @Args('driver_id') driver_id: string,
    @Args('officer_id') officer_id: string,
    @Args('vehicle_id') vehicle_id: string,
    @Args({ name: 'violation_type', type: () => [String] }) violation_type: string[], 
    @Args('desc') desc: string,
    @Args('date') date: Date,
    @Args('localisation') localisation: string,
    @Args('amende', { type: () => Float }) amende: number 
  ): Promise<Violations | null> {
    const formattedDate = new Date(date);

    // Update the violation with the provided data
    const updatedViolation = await this.violationsService.update(id_violations, {
      id_violations,
      driver_id,
      officer_id,
      vehicle_id,
      violation_type,
      desc,
      date: formattedDate,
      localisation,
      amende
    });

    return updatedViolation;
  }

  @Mutation(() => Violations, { nullable: true })
  async deleteViolation(@Args('id_violations') id_violations: string): Promise<Violations | null> {
    return this.violationsService.delete(id_violations);
  }
}
