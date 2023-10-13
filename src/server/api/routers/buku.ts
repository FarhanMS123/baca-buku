import { z } from "zod";
import os from "os";
import path from "path";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { bucket } from "~/server/utils/firebase";

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
            description: z.string().optional(),
            book: z.string(),
            thumb: z.string(),
            backsong_id: z.number(),
            audio_id: z.number(),
            segment: z.tuple([z.number(), z.number()]).array(),
        })).mutation(async ({ ctx: { db }, input }) => {
            const bookname = input.book;
            const bookpath = path.join(os.tmpdir(), bookname);
            const vname = `public/baca-buku/books/${bookname}`;

            const thumbname = input.thumb;
            const thumbpath = path.join(os.tmpdir(), thumbname);
            const tname = `public/baca-buku/thumbs/${bookname}`;

            const [book] = await bucket.upload(bookpath, {
                destination: vname,
                public: true,
            });
            const [thumb] = await bucket.upload(thumbpath, {
                destination: vname,
                public: true,
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
