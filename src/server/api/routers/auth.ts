import { z } from "zod";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
  guestProcedure
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
    register: guestProcedure.input(z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
    })).mutation(async ({ input: {name, email, password}, ctx: { db } }) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await db.user.create({
            data: {
                name, email,
                password: hash,
            },
        });
        console.log({ salt, hash, user });
        return true;
    }),
});
