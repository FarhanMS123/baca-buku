import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";

export const audioRouter = createTRPCRouter({
    getAudios: publicProcedure.query(() => "hello"),
    getAudio: publicProcedure.input(z.number()).query(() => "hello"),
    uploadAudio: adminProcedure
        .input(z.object({
            name: z.string(),
            audio_type: z.enum(["audio", "backsong", "main_theme"]),
            audio: z.string(),
        })).mutation(() => "hello"),
    updateAudio: adminProcedure
        .input(z.object({
            name: z.string().optional(),
            audio_type: z.enum(["audio", "backsong", "main_theme"]).optional(),
            audio: z.string().optional(),
        })).mutation(() => "hello"),
    deleteAudio: adminProcedure
        .input(z.number()).mutation(() => "hello"),
});
