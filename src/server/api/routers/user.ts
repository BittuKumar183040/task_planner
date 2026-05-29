import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email(), password: z.string(), image: z.string().optional() }))
    .mutation(async ({ ctx, input }) => { 
      const newUser = await ctx.db.user.create({
        data: { ...input },
      });
      return newUser;
    }),
  listUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  getSelf: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
  updateUser: protectedProcedure
    .input(z.object({ name: z.string().optional(), email: z.string().email().optional(), password: z.string().optional(), image: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: { ...input, updatedAt: new Date() },
      });
      return updatedUser;
    }),
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId;
      await ctx.db.user.delete({ where: { id: userId } });
      return { message: "User deleted successfully" };
  }),
});