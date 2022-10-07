import { ApolloServer } from 'apollo-server-lambda';
import fs from 'fs';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import resolvers from './resolvers';
import { getCurrentUser } from './utils/auth/auth';
import { authDirective } from './directives/auth.directive';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Callback, Context } from 'aws-lambda/handler';
import mongoose from 'mongoose';

const createHandler = async () => {
  try {
    const url = 'mongodb://localhost:27017/my-todos';
    await mongoose.connect(url);

    const { authDirectiveTransformer } = authDirective('auth');
    const schema = authDirectiveTransformer(
      makeExecutableSchema({
        typeDefs: [fs.readFileSync('./src/schema.graphql', 'utf8')],
        resolvers,
      }),
    );

    const server = new ApolloServer({
      schema,
      csrfPrevention: true,
      cache: 'bounded',
      context: async ({ event, context, express }) => {
        console.log(`CONTEXT : ${JSON.stringify(context)}`);
        console.log(`typeof express.req ::: ${typeof express.req}`);
        const user = getCurrentUser({ req: express.req });
        console.log(`Who : ${user}`);
        return {
          headers: event.headers,
          functionName: context.functionName,
          event,
          context,
          req: express.req,
          currentUser: user,
        };
      },
    });

    // launch the server when the Lambda is called
    return server.createHandler({
      expressAppFromMiddleware(middleware) {
        const app = express();
        app.use(graphqlUploadExpress());
        app.use(middleware);
        return app;
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.handler = async (
  event: unknown,
  context: Context,
  callback: Callback,
) => {
  const handler = await createHandler();
  if (!handler) throw 'server handler not found';
  if (handler) return await handler(event, context, callback);
};

process
  .on('SIGTERM', async () => {
    console.log(`Process ${process.pid} received a SIGTERM signal`);
    console.log('Closing the database connection');
  })
  .on('SIGINT', (signal) => {
    console.log(
      `Process ${process.pid} has been interrupted with signal :`,
      signal,
    );
  })
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
  });
