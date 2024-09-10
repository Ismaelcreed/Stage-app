import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class PoliceInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  police_name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  badge_number: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  rank: string;
}
