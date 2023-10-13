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
            const audiopath = path.join(os.tmpdir(), audioname);
            const vname = `public/baca-buku/audios/${audioname}`;

            const [file] = await bucket.upload(audiopath, {
                destination: vname,
                public: true,
            });

            const audio = await db.audio.create({
                data: {
                    name: input.name,
                    audio_type: input.audio_type,
                    blob_path: vname,
                    blob_url: file.publicUrl(),
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
            let audioname, audiopath, vname, file, audio;

            audio = await db.audio.findFirst({
                where: {
                    id: input.id,
                }
            });

            if (input.audio){
                audioname = input.audio;
                audiopath = path.join(os.tmpdir(), audioname);
                vname = `public/baca-buku/audios/${audioname}`;
                [file] = await bucket.upload(audiopath, {
                    destination: vname,
                    public: true,
                });
                /// @ts-ignore
                await bucket.file(audio.blob_path).delete();
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
                        blob_path: vname,
                        /// @ts-ignore
                        blob_url: file?.publicUrl(),
                    } : {}),
                },
            });

            return audio;
        }),
    deleteAudio: adminProcedure
        .input(z.number()).mutation(({ ctx: { db }, input }) => db.audio.delete({ where: { id: input } })),
});
