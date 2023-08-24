import { router } from "../trpc/trpc";
//Routers
import { mapRouter } from "./map";
import { inventoryRouter } from './inventory';
import { authRouter } from './auth';

export const appRouter = router({
  mapRouter,
  inventoryRouter,
  authRouter
});
