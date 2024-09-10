import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'src/upload/graphql-upload'; 
import { DriverService } from './driver.service';
import { Driver } from './driver.schema';

@Resolver(() => Driver)
export class DriverResolver {
  constructor(private readonly driverService: DriverService) {}

  @Query(() => [Driver])
  async drivers(): Promise<Driver[]> {
    return this.driverService.findAll();
  }

  @Query(() => Driver, { nullable: true })
  async driver(@Args('id_driver', { type: () => ID }) id_driver: string): Promise<Driver | null> {
    return this.driverService.findById(id_driver);
  }

  @Mutation(() => Driver)
  async createDriver(
    @Args('id_driver') id_driver: string,
    @Args('licence_number') licence_number: string,
    @Args('driver_name') driver_name: string,
    @Args('sex') sex: string,
    @Args('age', { type: () => Int }) age: number,
    @Args('address') address: string,
    @Args('phone') phone: string,
    @Args('profile', { type: () => GraphQLUpload, nullable: true }) profile?: FileUpload
  ): Promise<Driver> {
    if (profile) {
      // Traitement du fichier
      const profileUrl = await this.driverService.handleFileUpload(profile);
      return this.driverService.create({
        id_driver,
        licence_number,
        driver_name,
        sex,
        age,
        address,
        phone,
        profile: profileUrl,
      });
    }

    return this.driverService.create({
      id_driver,
      licence_number,
      driver_name,
      sex,
      age,
      address,
      phone,
      profile,
    });
  }

  @Mutation(() => Driver, { nullable: true })
  async updateDriver(
    @Args('id_driver', { type: () => ID }) id_driver: string,
    @Args('licence_number') licence_number: string,
    @Args('driver_name') driver_name: string,
    @Args('sex') sex: string,
    @Args('age') age: number,
    @Args('address') address: string,
    @Args('phone') phone: string,
    @Args('profile', { type: () => GraphQLUpload, nullable: true }) profile?: FileUpload
  ): Promise<Driver | null> {
    if (profile) {
      // Traitement du fichier
      const profileUrl = await this.driverService.handleFileUpload(profile);
      return this.driverService.update(id_driver, {
        id_driver,
        licence_number,
        driver_name,
        sex,
        age,
        address,
        phone,
        profile: profileUrl,
      });
    }

    return this.driverService.update(id_driver, {
      id_driver,
      licence_number,
      driver_name,
      sex,
      age,
      address,
      phone,
      profile,
    });
  }

  @Mutation(() => Driver, { nullable: true })
  async deleteDriver(@Args('id_driver', { type: () => ID }) id_driver: string): Promise<Driver | null> {
    return this.driverService.delete(id_driver);
  }
}
