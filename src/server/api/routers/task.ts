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
        priority: z.enum(["low", "medium", "high"]).default("medium"),
        status: z.enum(["new", "active", "completed"]).default("new"),
        deadline: z.date().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const newTask = await ctx.db.task.create({
        data: { ...input, createdById: userId },
      });
      return newTask;
    }),
  getTasks: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db.task.findMany({
      where: {
        OR: [
          { createdById: userId },
          { assignedToId: userId },
        ],
      },
    });
  }),
  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const taskId = input.taskId;
      const task = await ctx.db.task.findUnique({ where: { id: taskId } });
      if (!task) {
        throw new Error("Task not found");
      }
      if (task.createdById !== userId && task.assignedToId !== userId) {
        throw new Error("Unauthorized");
      }
      await ctx.db.task.delete({ where: { id: taskId } });
      return { message: "Task deleted successfully" };
    })
});