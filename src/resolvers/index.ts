import { prisma } from "../generated/prisma-client";

export const resolvers = {
  Query: {
    users: () => prisma.users()
  },
};