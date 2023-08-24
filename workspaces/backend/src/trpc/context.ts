import * as trpc from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/express";
import { verifyJwtToken } from "../common/utils";
import { prismaClient } from "../common/prisma";

export async function createContext({
  req,
  res,
}: trpcNext.CreateExpressContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you might want to do in your ctx fn
  async function getUser() {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const userData = verifyJwtToken(token);

      if (userData?.email) {
        return await prismaClient.user.findFirst({
          where: { email: userData.email },
        });
      }

      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
      });
    }
    return null;
  }

  const user = await getUser();

  return {
    req,
    res,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
