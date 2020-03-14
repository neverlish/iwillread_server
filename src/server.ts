import { GraphQLServer } from 'graphql-yoga';
import * as fs from 'fs';
import * as path from 'path';
import { resolvers } from './resolvers';

const typeDefs = fs.readFileSync(path.join(__dirname, './generated.graphql')).toString();

const server = new GraphQLServer({
  typeDefs: [typeDefs],
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false },
});

server.start({
  cors: {
    origin: '*',
    credentials: true,
  },
  playground: false,
  endpoint: '/graphql',
});
