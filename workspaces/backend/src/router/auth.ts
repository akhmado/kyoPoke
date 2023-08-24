import { protectedProcedure, publicProcedure, router } from "../trpc/trpc";
import { signJwtToken } from "../common/utils";
import z from "zod";
import { prismaClient } from "../common/prisma";
import md5 from "md5";

export const authRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const isExistingUser = await prismaClient.user.findFirst({
        where: { email: input.email },
      });

      if (isExistingUser) {
        return { msg: "This user is already signed up" };
      }

      await prismaClient.user.create({
        data: {
          email: input.email,
          password: md5(input.password),
        },
      });

      return { msg: "Signed up successfully" };
    }),

  logIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const isExistingUser = await prismaClient.user.findFirst({
        where: { email: input.email },
      });

      if (!isExistingUser) {
        return { msg: "Incorrect credentials", token: null };
      }

      if (isExistingUser.password == md5(input.password)) {
        return {
          msg: "Correct credentials",
          token: signJwtToken(isExistingUser.email),
        };
      }

      return { msg: "Incorrect credentials", token: null };
    }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    return prismaClient.user.findUnique({
      where: { email: ctx.user?.email },
      select: {
        id: true,
        email: true,
      }
    });
  }),
});
