import { z } from "zod";
import { db } from "@content-guru/db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({ text: z.string() })).query(({}) => {
    return {
      greeting: `Hello`,
    };
  }),

  getUsers: publicProcedure.query(async () => {
    const users = await db.query.tbl_users.findMany();
    return users;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
