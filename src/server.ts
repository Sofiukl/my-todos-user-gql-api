import { ApolloServer } from "apollo-server-lambda";
import fs from "fs";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload";
import resolvers from "./resolvers";
import { getCurrentUser } from "./utils/auth/auth";
import { authDirective } from "./directives/auth.directive";
import { makeExecutableSchema } from "@graphql-tools/schema";

const { authDirectiveTransformer } = authDirective("auth");
const schema = fs.readFileSync("./src/schema.graphql", "utf8");
let schemaWithDirective = makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
});
schemaWithDirective = authDirectiveTransformer(schemaWithDirective);

const server = new ApolloServer({
  schema: schemaWithDirective,
  csrfPrevention: true,
  cache: "bounded",
  context: ({ event, context, express }) => {
    const user = getCurrentUser({ req: express.req });
    console.log(`Who : ${JSON.stringify(user)}`);
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
exports.handler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    app.use(customMiddleware);
    app.use(graphqlUploadExpress());
    app.use(middleware);
    return app;
  },
});

function customMiddleware(req: any, res: any, next: any) {
  next();
}
