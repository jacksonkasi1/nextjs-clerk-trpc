import { z } from "zod";
import { db, eq } from "@content-guru/db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { tbl_users } from "@content-guru/db/src/schema";

export const userRouter = createTRPCRouter({
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.userId) {
      return null;
    }

    const user = await db.query.tbl_users.findFirst({
      where: eq(tbl_users.external_id, ctx.session.userId),
      columns: {
        external_id: true,
        id: true,
        figma_id: true,
        first_name: true,
        last_name: true,
        email: true,
        photo_url: true,
      },
    });

    return user;
  }),

  updateUserProfile: protectedProcedure
    .input(
      z.object({
        first_name: z.string(),
        last_name: z.string(),
        photo_url: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.userId;

      const users = await db
        .update(tbl_users)
        .set({
          first_name: input.first_name,
          last_name: input.last_name,
          photo_url: input.photo_url,
        })
        .where(eq(tbl_users.external_id, userId))
        .returning({ external_id: tbl_users.external_id });

      return {
        success: true,
        message: "Profile updated successfully",
        data: {
          ...users[0],
        },
      };
    }),
});
