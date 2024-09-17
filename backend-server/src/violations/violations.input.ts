import { InputType, Field ,Int ,Float} from '@nestjs/graphql';
import {  IsNotEmpty } from 'class-validator';

@InputType()
export class ViolationsInput {
  @Field()
  id_violations: string;

  @Field()
  driver_id: string;

  @Field()
  officer_id: string;

  @Field()
  vehicle_id: string;

  @Field(() => [String])
  violation_type: string[];

  @Field()
  desc: string;

  @Field()
  date: Date;

  @Field()
  localisation: string;

  @Field(() => Float)
  amende: number;
}
