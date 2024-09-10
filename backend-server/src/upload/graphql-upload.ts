import { GraphQLScalarType } from 'graphql';
import { ReadStream } from 'fs';

export type FileUpload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
};

export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'Le type scalaire `Upload` représente un téléversement de fichier.',
  parseValue(value) {
    return value; // valeur venant du client
  },
  parseLiteral(ast) {
    throw new Error('Les littéraux Upload ne sont pas supportés');
  },
  serialize(value) {
    return value; // valeur envoyée au client
  },
});
