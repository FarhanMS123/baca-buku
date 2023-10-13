import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { audioRouter } from "./routers/audio";
import { bukuRouter } from "./routers/buku";
import { debugRouter } from "./routers/debug";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  audio: audioRouter,
  buku: bukuRouter,
  debug: debugRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
