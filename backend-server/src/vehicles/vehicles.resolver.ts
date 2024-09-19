import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicles } from './vehicles.schema';

@Resolver(() => Vehicles)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => [Vehicles])
  async vehicles(): Promise<Vehicles[]> {
    return this.vehiclesService.findAll();
  }

  @Query(() => Vehicles, { nullable: true })
  async vehicle(@Args('id_vehicles') id_vehicles: string): Promise<Vehicles | null> {
    return this.vehiclesService.findOne(id_vehicles);
  }

  @Mutation(() => Vehicles)
  async createVehicle(
    @Args('id_vehicles') id_vehicles: string,
    @Args('licence_plate') licence_plate: string,
    @Args('mark') mark: string,
    @Args('modele') modele: string,
    @Args('year') year: string,
    @Args('color') color: string,
    @Args('owner_id') owner_id: string, // owner_id est un champ simple
  ): Promise<Vehicles> {
    return this.vehiclesService.create({
      id_vehicles,
      licence_plate,
      mark,
      modele,
      year,
      color,
      owner_id,
    });
  }

  @Mutation(() => Vehicles, { nullable: true })
  async updateVehicle(
    @Args('id_vehicles') id_vehicles: string,
    @Args('licence_plate') licence_plate: string,
    @Args('mark') mark: string,
    @Args('modele') modele: string,
    @Args('year') year: string,
    @Args('color') color: string,
    @Args('owner_id') owner_id: string, // owner_id est optionnel
  ): Promise<Vehicles | null> {
    return this.vehiclesService.update(id_vehicles, {
      id_vehicles,
      licence_plate,
      mark,
      modele,
      year,
      color,
      owner_id,
    });
  }

  @Mutation(() => Vehicles, { nullable: true })
  async deleteVehicle(@Args('id_vehicles') id_vehicles: string): Promise<Vehicles | null> {
    return this.vehiclesService.delete(id_vehicles);
  }
}
