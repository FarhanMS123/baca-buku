import { z } from "zod";
import { put, del } from "@vercel/blob";
import { readFile } from "fs/promises";
import os from "os";
import path from "path";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";

export const bukuRouter = createTRPCRouter({
    getBukus: publicProcedure.query(({ ctx: { db } }) => db.book.findMany()),
    getBuku: publicProcedure
        .input(z.number())
        .query(({ ctx: { db }, input }) => db.book.findFirst({
            where: {
                id: input,
            }
        })),
    addBuku: adminProcedure
        .input(z.object({
            name: z.string(),
            description: z.string(),
            book: z.string(),
            backsong_id: z.number(),
            audio_id: z.number(),
            segment: z.tuple([z.number(), z.number()]).array(),
        })).mutation(async ({ ctx: { db }, input }) => {
            const bookname = encodeURIComponent(input.book);
            const blob = await readFile(path.join(os.tmpdir(), bookname));
            const vname = `books/${bookname}`;

            const file = await put(vname, blob, {
                access: "public",
            });
        }),
    updateBuku: adminProcedure
        .input(z.object({
            id: z.number(),
            name: z.string().optional(),
            description: z.string().optional(),
            book: z.string().optional(),
            backsong_id: z.number().optional(),
            audio_id: z.number().optional(),
            segment: z.tuple([z.number(), z.number()]).array().optional(),
        })).mutation(() => "hello"),
    deleteBuku: adminProcedure
        .input(z.number())
        .mutation(({ ctx: { db }, input }) => db.book.delete({
            where: {
                id: input,
            }
        })),
});
