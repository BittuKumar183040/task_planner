import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        assignedToId: z.string().optional(),
        teamId: z.string(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
        status: z.enum(["new", "active", "completed"]).default("new"),
        deadline: z.date().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const newTask = await ctx.db.task.create({
        data: {
          ...input,
          createdById: userId,
        },
      });
      return newTask;
    }),
  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        assignedToId: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
        status: z.enum(["new", "active", "completed"]).default("new"),
        deadline: z.date().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const updatedTask = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          ...input,
          createdById: userId,
        },
      });
      return updatedTask;
    }),
  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["new", "active", "completed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedTask = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          status: input.status,
        },
      });
      return updatedTask;
    }),
  getTaskById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const id = input.id;
      const task = await ctx.db.task.findUnique({
        where: { id },
        include: {
          assignedTo: {
            select: { id: true, username: true, image: true },
          },
          createdBy: {
            select: { id: true, username: true, image: true },
          },
        },
      });
      if (!task) {
        throw new Error("Task not found");
      }
      if (task.createdById !== userId && task.assignedToId !== userId) {
        throw new Error("Unauthorized");
      }
      return task;
    }),
  getTasks: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.task.findMany({
        where: {
          teamId: input.teamId,
          assignedToId: userId,
        },
        include: {
          assignedTo: {
            select: { id: true, username: true, image: true },
          },
          createdBy: {
            select: { id: true, username: true, image: true },
          },
        },
      });
    }),
  getTeamTasks: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          teamId: input.teamId
        },
        include: {
          assignedTo: {
            select: { id: true, username: true, image: true },
          },
          createdBy: {
            select: { id: true, username: true, image: true },
          },
        },
      });
    }),
  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const taskId = input.taskId;
      const task = await ctx.db.task.findUnique({ where: { id: taskId } });
      if (!task) {
        throw new Error("Task not found");
      }
      await ctx.db.task.delete({ where: { id: taskId } });
      return { message: "Task deleted successfully" };
    })
});