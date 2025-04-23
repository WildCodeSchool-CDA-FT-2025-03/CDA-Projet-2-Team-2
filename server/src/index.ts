import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';

import { dataSource } from './database/client';
import { HelloResolver } from './resolvers/hello.resolver';
import { AuthResolver } from './resolvers/auth.resolver';

import 'dotenv/config';
import 'reflect-metadata';

async function startServer() {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [HelloResolver, AuthResolver],
  });

  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT as string) || 4000 },
    context: async ({ res }) => ({ res }),
  });

  console.info(`🚀 Server ready at ${url}`);
}

startServer();
