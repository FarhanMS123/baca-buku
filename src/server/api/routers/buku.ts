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

let t;

export const bukuRouter = createTRPCRouter({
    getBukus: publicProcedure.query(({ ctx: { db } }) => db.book.findMany({
        include: {
            audio: true,
            backsong: true,
        }
    })),
    getBuku: publicProcedure
        .input(z.number())
        .query(async ({ ctx: { db }, input }) => {
            if (!t) t = await db.book.findFirst({
                where: {
                    id: input,
                },
                include: {
                    audio: true,
                    backsong: true,
                }
            });
            return t;
        }),
    addBuku: adminProcedure
        .input(z.object({
            name: z.string(),
            description: z.string().optional().default(""),
            book: z.string(),
            thumb: z.string(),
            backsong_id: z.number(),
            audio_id: z.number(),
            segment: z.object({
                timestamp: z.number(),
                page: z.number(),
            }).array().default([]),
        })).mutation(async ({ ctx: { db }, input }) => {
            const bookname = input.book;
            const bookpath = path.join(os.tmpdir(), bookname);
            const vname = `public/baca-buku/books/${bookname}`;

            const thumbname = input.thumb;
            const thumbpath = path.join(os.tmpdir(), thumbname);
            const tname = `public/baca-buku/thumbs/${thumbname}`;

            const [book] = await bucket.upload(bookpath, {
                destination: vname,
                public: true,
            });
            const [thumb] = await bucket.upload(thumbpath, {
                destination: tname,
                public: true,
            });

            await db.book.create({
                data: {
                    name: input.name,
                    description: input.description,
                    blob_path: vname,
                    blob_url: book.publicUrl(),
                    thumb_path: tname,
                    thumb_url: thumb.publicUrl(),
                    audio_id: input.audio_id,
                    backsong_id: input.backsong_id,
                    segment: input.segment,
                }
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
