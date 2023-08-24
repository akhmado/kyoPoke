import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from "@kyohealth/app-backend/src/index";

export const trpc = createTRPCReact<AppRouter>();
