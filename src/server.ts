import { GraphQLServer } from 'graphql-yoga';
import * as fs from 'fs';
import * as path from 'path';

const typeDefs = fs.readFileSync(path.join(__dirname, './generated.graphql')).toString();

const server = new GraphQLServer({
  typeDefs,
  resolvers: {},
  resolverValidationOptions: { requireResolversForResolveType: false },
});

server.start(() => console.log('start'));