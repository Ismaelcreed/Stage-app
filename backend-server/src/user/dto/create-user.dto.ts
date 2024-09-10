import { ObjectType, Field} from '@nestjs/graphql';
import { IsString, IsEmail, MinLength } from 'class-validator';

@ObjectType()
export class CreateUserDto {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}
