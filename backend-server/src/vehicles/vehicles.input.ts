import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class VehiclesInput {
  @Field()
  @IsString()
  id_vehicles: string;

  @Field()
  @IsString()
  licence_plate: string;

  @Field()
  @IsString()
  mark: string;

  @Field()
  @IsString()
  modele: string;  

  @Field()
  @IsString()
  year: string;

  @Field()
  @IsString()
  color: string;

  @Field(() => String)
  @IsString()
  owner_id?: string;
}
