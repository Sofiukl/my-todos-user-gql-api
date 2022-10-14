import fs from 'fs';
import resolvers from './resolvers';
import { getCurrentUser } from './utils/auth/auth';
import { authDirective } from './directives/auth.directive';
import { makeExecutableSchema } from '@graphql-tools/schema';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import * as dotenv from 'dotenv';
dotenv.config();

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4000');

const createHandler = async () => {
  try {
    let dbUrl = 'mongodb://localhost:27017/my-todos';
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) dbUrl = process.env.MONGODB_URI || '';
    await mongoose.connect(dbUrl);

    const { authDirectiveTransformer } = authDirective('auth');
    const schema = authDirectiveTransformer(
      makeExecutableSchema({
        typeDefs: [fs.readFileSync('./src/schema.graphql', 'utf8')],
        resolvers,
      }),
    );

    const server: ApolloServer = new ApolloServer({
      schema,
      csrfPrevention: true,
      cache: 'bounded',
      context: async ({ req }) => {
        console.log(`typeof express.req ::: ${typeof req}`);
        const user = getCurrentUser({ req });
        console.log(`Who : ${JSON.stringify(user)}`);
        return {
          req,
          currentUser: user,
        };
      },
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    const { url } = await server.listen(port);
    console.log(`🚀  Server ready at ${url}`);
  } catch (err) {
    console.log(err);
    return null;
  }
};

createHandler();
