import { Request } from "express";
import { User } from "../models/index.js";
import { AuthenticationError } from "../services/auth.js";
import jwt from "jsonwebtoken";

interface addUserArgs {
  username: string;
  email: string;
  password: string;
}

interface loginArgs {
  username: string;
  email: string;
  password: string;
}

interface saveBookArgs {
  userId: string;
  bookData: {
    bookId: string;
  };
}
interface deleteBookArgs {
  userId: string;
  bookId: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate(
          "savedBooks"
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    login: async (_parent: unknown, args: loginArgs, _context: any) => {
      // Use a single findOne call to look up the user by username or email.
      const user = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });

      if (!user) {
        throw new AuthenticationError(
          "Could not find anyone by that username or email, you silly billy."
        );
      }

      const correctPw = await user.isCorrectPassword(args.password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      // Generate a token. Ensure that process.env.JWT_SECRET is defined in your environment.
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      return {
        token,
        user,
      };
    },
    saveBook: async (
      _parent: unknown,
      args: saveBookArgs,
      context: Request
    ) => {
      if (context.user) {
        const book = await User.findOneAndUpdate(
          { _id: args.userId },
          { $addToSet: { savedBooks: args.bookData.bookId } },
          { new: true, runValidators: true }
        );
        return book;
      }
      throw new AuthenticationError(
        "You need to be logged in to save a book! fosheezy!"
      );
    },
    deleteBook: async (
      _parent: unknown,
      args: deleteBookArgs,
      context: Request
    ) => {
      if (context.user) {
        const book = await User.findOneAndUpdate(
          {
            _id: args.userId,
          },
          {
            $pull: { savedBooks: { bookId: args.bookId } },
          }
        );
        return book;
      }
      throw new AuthenticationError(
        "You need to be logged in to delete a book!"
      );
    },
    addUser: async (_parent: unknown, args: addUserArgs) => {
      const user = await User.create(args);
      if (!user) {
        throw new AuthenticationError(
          "Something is wrong with your user creation, my friend."
        );
      }
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      return {
        token,
        user,
      };
    },
  },
};

export default resolvers;
