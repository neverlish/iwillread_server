require('dotenv').config();

import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { GraphQLServer } from 'graphql-yoga';
import * as path from 'path';
import { resolvers } from './resolvers';
import authRouter from './routes/auth';


const typeDefs = fs.readFileSync(path.join(__dirname, './generated.graphql')).toString();

const server = new GraphQLServer({
  typeDefs: [typeDefs],
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false },
  context: (req) => {
    const authorization = (req.request.headers.authorization ? req.request.headers.authorization.replace(/^Bearer\s*?/, '') : '').trim();
    const user = authorization
      ? jwt.verify(authorization, process.env.JWTSECRET)
      : undefined;
    return { req, user };
  },
});

server.use(cookieParser());
server.use('/auth', authRouter);


server.start({
  cors: {
    origin: '*',
    credentials: true,
  },
  playground: false,
  endpoint: '/graphql',
});
