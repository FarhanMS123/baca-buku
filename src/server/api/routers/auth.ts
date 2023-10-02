import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
    register: publicProcedure.input(z.object({})).mutation(async ({}) => {}),
});
