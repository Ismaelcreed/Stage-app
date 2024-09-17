import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MonthlyInfraction {
  @Field(() => Int)
  month: number;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class StatsType {
  @Field(() => Int)
  totalAgents: number;

  @Field(() => Int)
  totalConducteurs: number;

  @Field(() => Int)
  totalVehicules: number;

  @Field(() => Int)
  totalViolations: number;

  @Field(() => Int)
  excessSpeed: number; // Pour les excès de vitesse

  @Field(() => Int)
  illegalParking: number; // Pour le stationnement illégal

  @Field(() => Int)
  signalViolation: number; // Pour les violations des signaux

  @Field(() => Int)
  drivingUnderInfluence: number; // Pour la conduite sous influence

  @Field(() => Int)
  specificInfractions: number; // Pour les infractions spécifiques

  @Field(() => Int)
  vehicleRelatedInfractions: number;// Pour les infractions liées au véhicule

}
