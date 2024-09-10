import { Resolver, Query, Args  ,Mutation } from '@nestjs/graphql';
import { UserService } from '../service/user.service';
import { UserGraphQL } from '../dto/user.dto'
import { GraphQLContext } from './graphql.context';
import { CreateUserDto } from '../dto/create-user.dto';

@Resolver(() => UserGraphQL) 
export class UserResolver {
    constructor(private readonly userService: UserService) {}
  
    @Query(() => UserGraphQL, { nullable: true }) 
    async me(@Args('email') email: string): Promise<UserGraphQL | null> {
      if (!email) {
        throw new Error("L'argument 'email' est requis.");
      }
      
      const user = await this.userService.findByEmail(email);
      if (!user) return null;
  
      return {
        id: user.id.toString(), 
        username: user.username,
        email: user.email,
      };
    }
    @Mutation(() => UserGraphQL)
    async signup(
      @Args('username') username: string,
      @Args('email') email: string,
      @Args('password') password: string,
    ): Promise<UserGraphQL> {
      if (!username || !email || !password) {
        throw new Error('Tous les champs sont requis.');
      }
  
      const user = await this.userService.create({ username, email, password });
  
      if (!user) {
        throw new Error('Erreur lors de la création de l\'utilisateur.');
      }
  
  
      return {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
      };
    }
  
  }
