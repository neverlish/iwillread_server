import { prisma } from "../generated/prisma-client";

export const resolvers = {
  Query: {
    users: () => prisma.users(),
    me: async (_, __, { me }) => {
      return (me && me.id)
        ? await prisma.user({ id: me.id })
        : null;
    },
    books: (_, args) => prisma.books(args),
    book: (_, args) => prisma.book(args),
  },
  Book: {
    author: ({ id }) => prisma.book({ id }).author(),
    hashtags: ({ id }) => prisma.book({ id }).hashtags(),
  },
};