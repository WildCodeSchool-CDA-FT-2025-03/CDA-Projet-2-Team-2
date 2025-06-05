import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import createSchema from './schema';
import { dataSource } from './database/client';
import { grpcClient } from './utils/grpcClient';

import 'dotenv/config';
import 'reflect-metadata';
import { getUserFromToken } from './utils/jwt.utils';

async function startServer() {
  await dataSource.initialize();

  const schema = await createSchema();

  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT as string) || 4000 },
    context: async ({ req, res }) => {
      const user = await getUserFromToken(req.headers.cookie || '');

      return {
        req,
        res,
        grpcClient,
        user,
      };
    },
  });
  grpcClient.createLog('Server has started', { server: 'started' });

  console.info(`🚀 Server ready at ${url}`);
}

startServer();
