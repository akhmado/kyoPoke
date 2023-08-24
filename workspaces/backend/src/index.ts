import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router/index";
import express, { Express } from "express";
import cors from "cors";
import { createContext } from "./trpc/context";

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

export type AppRouter = typeof appRouter;
