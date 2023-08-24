import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import { verifyJwtToken } from "../common/utils";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
// const t = initTRPC.create();
export const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  const token = ctx.req.headers.authorization?.split(' ')[1];

  if (token && verifyJwtToken(token)) {
    return next();
  }

  throw new TRPCError({
    code: "UNAUTHORIZED",
  });
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
