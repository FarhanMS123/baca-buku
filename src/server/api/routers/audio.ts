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

export const audioRouter = createTRPCRouter({
    getAudios: publicProcedure
        .input(z.enum(["audio", "backsong", "main_theme"]).optional())
        .query(({ ctx: { db }, input }) => db.audio.findMany({
            where: input ? {
                audio_type: input,
            } : {},
        })),
    getAudio: publicProcedure
        .input(z.number())
        .query(({ ctx: { db }, input }) => db.audio.findFirst({
            where: {
                id: input,
            }
        })),
    uploadAudio: adminProcedure
        .input(z.object({
            name: z.string(),
            audio_type: z.enum(["audio", "backsong", "main_theme"]),
            audio: z.string(),
        })).mutation(async ({ ctx: { db }, input }) => {
            // const audioname = encodeURIComponent(input.audio);
            const audioname = input.audio;
            const blob = await readFile(path.join(os.tmpdir(), audioname));
            const vname = `audios/${audioname}`;

            const file = await put(vname, blob, {
                access: "public",
            });

            const audio = await db.audio.create({
                data: {
                    name: input.name,
                    audio_type: input.audio_type,
                    blob_path: file.pathname,
                    blob_url: file.url,
                },
            });

            return audio;
        }),
    updateAudio: adminProcedure
        .input(z.object({
            id: z.number(),
            name: z.string().optional(),
            audio_type: z.enum(["audio", "backsong", "main_theme"]).optional(),
            audio: z.string().optional(),
        })).mutation(async ({ ctx: { db }, input }) => {
            let audioname, blob, vname, file, audio;

            audio = await db.audio.findFirst({
                where: {
                    id: input.id,
                }
            });

            if (input.audio){
                audioname = encodeURIComponent(input.audio);
                blob = await readFile(path.join(os.tmpdir(), audioname));
                vname = `audios/${audioname}`;
                file = await put(vname, blob, {
                    access: "public",
                });
                /// @ts-ignore
                await del(audio.blob_url);
            }

            audio = await db.audio.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...(input.name ? {name: input.name} : {}),
                    ...(input.audio_type ? {audio_type: input.audio_type} : {}),
                    ...(input.audio ? {
                        /// @ts-ignore
                        blob_path: file.pathname,
                        /// @ts-ignore
                        blob_url: file.url
                    } : {}),
                },
            });

            return audio;
        }),
    deleteAudio: adminProcedure
        .input(z.number()).mutation(({ ctx: { db }, input }) => db.audio.delete({ where: { id: input } })),
});
