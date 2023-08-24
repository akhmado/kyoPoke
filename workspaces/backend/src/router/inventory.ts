import { protectedProcedure, router } from "../trpc/trpc";
import z from "zod";
import { prismaClient } from "../common/prisma";

export const inventoryRouter = router({
  getMyInventory: protectedProcedure.input(z.object({
    filterBy: z.enum(['CATCHED', 'DISCOVERED']).optional()
  })).query(async ({ ctx, input }) => {
    return await prismaClient.pokemon.findMany({
      where: {
        userId: ctx.user?.id,
        type: input?.filterBy
      },
    });
  }),
});
