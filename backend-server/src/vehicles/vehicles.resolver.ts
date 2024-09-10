import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { DriverService } from '../driver/driver.service'; // Assurez-vous d'importer le service des conducteurs
import { Vehicles } from './vehicles.schema'; // Assurez-vous que le chemin est correct
import { Driver } from '../driver/driver.schema'; // Assurez-vous que le chemin est correct

@Resolver(() => Vehicles)
export class VehiclesResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly driverService: DriverService
  ) {}

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
    @Args('owner_id') owner_id?: string,
  ): Promise<Vehicles> {
    if (owner_id) {
      const driver = await this.driverService.findById(owner_id);
      if (!driver) {
        throw new Error(`Conducteur avec ID ${owner_id} non trouvé.`);
      }
    }
    return this.vehiclesService.create({
      id_vehicles,
      licence_plate,
      mark,
      modele,
      year,
      color,
      owner_id ,
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
    @Args('owner_id') owner_id?: string, // owner_id peut être optionnel
  ): Promise<Vehicles | null> {
    if (owner_id) {
      const driver = await this.driverService.findById(owner_id);
      if (!driver) {
        throw new Error(`Conducteur avec ID ${owner_id} non trouvé.`);
      }
    }
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

  @ResolveField(() => String, { nullable: true })
  async driverName(@Parent() vehicle: Vehicles): Promise<string | null> {
    if (!vehicle.owner_id) {
      return null;
    }
  
    const driverId = vehicle.owner_id.toString();
    
    const driver = await this.driverService.findById(driverId);
    return driver ? driver.driver_name : 'Propriétaire inconnu';
  }
  
}