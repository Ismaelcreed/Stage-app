import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsDateString } from 'class-validator';

@InputType()
export class ViolationsInput {
  @Field()
  @IsString()
  id_violations: string;

  @Field(() => ID)
  @IsString()
  driver_id: string;

  @Field(() => ID)
  @IsString()
  officer_id: string;

  @Field(() => ID)
  @IsString()
  vehicle_id: string;

  @Field()
  @IsString()
  violation_type: string;

  @Field()
  @IsString()
  desc: string;

  @Field()
  @IsDateString()
  date: Date;

  @Field()
  @IsString()
  localisation: string;
}
