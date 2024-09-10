import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PoliceService } from './police.service';
import { Police } from './police.schema';

@Resolver(() => Police)
export class PoliceResolver {
  constructor(private readonly policeService: PoliceService) {}

  @Query(() => [Police])
  async polices(): Promise<Police[]> {
    return this.policeService.findAll();
  }

  @Query(() => Police, { nullable: true })
  async police(@Args('badge_number') badge_number: string): Promise<Police | null> {
    return this.policeService.findOne(badge_number);
  }

  @Mutation(() => Police)
  async createPolice(
    @Args('police_name') police_name: string,
    @Args('badge_number') badge_number: string,
    @Args('rank') rank: string,
  ): Promise<Police> {
    return this.policeService.create({ police_name, badge_number, rank });
  }

  @Mutation(() => Police, { nullable: true })
  async updatePolice(
    @Args('badge_number') badge_number: string,
    @Args('police_name') police_name: string,
    @Args('rank') rank: string,
  ): Promise<Police | null> {
    return this.policeService.update(badge_number, { police_name, badge_number, rank });
  }

  @Mutation(() => Police, { nullable: true })
  async deletePolice(@Args('badge_number') badge_number: string): Promise<Police | null> {
    return this.policeService.delete(badge_number);
  }
}
