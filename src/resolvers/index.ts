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
    book: (_, args) => prisma.book({ id: args.where.id }),
  },
  User: {
    bookReads: ({ id }) => prisma.user({ id }).bookReads(),
    bookWants: ({ id }) => prisma.user({ id }).bookWants(),
  },
  Book: {
    author: ({ id }) => prisma.book({ id }).author(),
    hashtags: ({ id }) => prisma.book({ id }).hashtags(),
    bookReads: ({ id }) => prisma.book({ id }).bookReads(),
    bookWants: ({ id }) => prisma.book({ id }).bookWants(),
    userRegistered: ({ id }) => prisma.book({ id }).userRegistered(),
  },
  UserBookWant: {
    user: ({ id }) => prisma.userBookWant({ id }).user(),
    book: ({ id }) => prisma.userBookWant({ id }).book(),
  },
  UserBookRead: {
    user: ({ id }) => prisma.userBookRead({ id }).user(),
    book: ({ id }) => prisma.userBookRead({ id }).book(),
  },
};