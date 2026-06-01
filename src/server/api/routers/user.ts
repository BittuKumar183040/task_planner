import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({ name: z.string(), username: z.string().min(2).max(100), email: z.string().email(), password: z.string(), image: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findFirst({
        where: { OR: [{ email: input.email }, { username: input.username }] },
      });
      if (existingUser) {
        if (existingUser.email === input.email) {
          throw new TRPCError({ code: "CONFLICT", message: "User with this email already exists"});
        }
        if (existingUser.username === input.username) {
          throw new TRPCError({ code: "CONFLICT", message: "User with this username already exists"});
        }
      }
      const hashedPassword = await bcrypt.hash( input.password, 10 );
      const newUser = await ctx.db.user.create({
        data: { ...input, password: hashedPassword },
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
  getUsersByTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [members, assignedCounts, createdCounts] = await Promise.all([
        ctx.db.teamMember.findMany({
          where: { teamId: input.teamId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                email: true,
                emailVerified: true,
              },
            },
          },
        }),
        ctx.db.task.groupBy({
          by: ["assignedToId"],
          where: { teamId: input.teamId },
          _count: { id: true },
        }),
        ctx.db.task.groupBy({
          by: ["createdById"],
          where: { teamId: input.teamId },
          _count: { id: true },
        }),
      ]);

      return members.map((m) => ({
        ...m.user,
        role:m.role,
        _count: {
          tasksAssigned: assignedCounts.find((c) => c.assignedToId === m.userId)?._count.id ?? 0,
          tasksCreated: createdCounts.find((c) => c.createdById === m.userId)?._count.id ?? 0,
        },
      }));
    }),
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { username: input.username },
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
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { email: input.email } });
      if (!user) {
        throw new Error("User with this email does not exist");
      }
      // Here you would generate a password reset token and send an email to the user
      return { message: "Password reset instructions sent to email" };
    }),
  updateImage: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: { image: input.image, updatedAt: new Date() },
      });
      return updatedUser;
    }),
});