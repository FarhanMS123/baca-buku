import { z } from "zod";
import { put, del, list, head } from "@vercel/blob";
import { readFile } from "fs/promises";
import os from "os";
import path from "path";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";

export const debugRouter = createTRPCRouter({
    listVercelBlob: adminProcedure.query(() => list()),
    getVercelBlob: adminProcedure.input(z.string()).query(({ input }) => head(input)),
    delVercelBlob: adminProcedure.input(z.string()).mutation(({ input }) => del(input)),
});
