import { Resolver, Mutation, Args , Query } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { GraphQLUpload, FileUpload } from './graphql-upload';
import { ApolloServer , gql } from 'apollo-server-express';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Query(() => String)
  async getName() : Promise <string>{
    return  "Sary"
  }

  @Mutation(() => String )
  async uploadFile(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload): Promise<string> {
    return this.uploadService.saveFile(file);
  }
}
