import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class DriverInput {
  @Field()
  @IsNotEmpty()
  id_driver: string;

  @Field()
  @IsNotEmpty()
  licence_number: string;

  @Field()
  @IsNotEmpty()
  driver_name: string;

  @Field()
  @IsNotEmpty()
  sex: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  age: number;

  @Field()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsNotEmpty()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  profile?: string;
}
