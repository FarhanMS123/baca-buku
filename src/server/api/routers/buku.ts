import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";

export const bukuRouter = createTRPCRouter({
    getBukus: publicProcedure.query(() => "hello"),
    getBuku: publicProcedure.input(z.number()).query(() => "hello"),
    addBuku: adminProcedure
        .input(z.object({
            name: z.string(),
            description: z.string(),
            backsong: z.string(),
            audio: z.string(),
            segment: z.tuple([z.number(), z.number()]).array(),
        })).mutation(() => "hello"),
    updateBuku: adminProcedure
        .input(z.object({
            name: z.string(),
            description: z.string(),
            backsong: z.string(),
            audio: z.string(),
            segment: z.tuple([z.number(), z.number()]).array(),
        })).mutation(() => "hello"),
    deleteBuku: adminProcedure
        .input(z.number()).mutation(() => "hello"),
});
