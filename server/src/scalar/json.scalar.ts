import { GraphQLScalarType, Kind } from 'graphql';

export const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type for logs',

  parseValue(value) {
    return typeof value === 'string' ? JSON.parse(value) : value;
  },

  serialize(value) {
    return value;
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }
    return null;
  },
});
