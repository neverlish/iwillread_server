import { prisma } from "../generated/prisma-client";

export const resolvers = {
  Query: {
    users: () => prisma.users(),
    me: async (_, __, { me }) => {
      return (me && me.id)
        ? await prisma.user({ id: me.id })
        : null;
    }
  },
};