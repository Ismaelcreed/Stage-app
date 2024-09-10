import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserGraphQL {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;
}
