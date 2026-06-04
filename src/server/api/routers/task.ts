import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { createTaskService, deleteTaskService, getTaskByIdService, getTasksService, getTeamTasksService, updateTaskService, updateTaskStatusService } from "~/server/service/task.service";

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
      return createTaskService( ctx.db, ctx.session.user.id, input);
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
      return updateTaskService(ctx.db, ctx.session.user.id, input.id, input);
    }),
  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["new", "active", "completed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateTaskStatusService(ctx.db, input.id, input.status);
    }),
  getTaskById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const id = input.id;
      const task = await getTaskByIdService(ctx.db, id);
      return task;
    }),
  getTasks: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return getTasksService(ctx.db, input.teamId, userId);
    }),
  getTeamTasks: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(({ ctx, input }) => {
      return getTeamTasksService(ctx.db, input.teamId);
    }),
  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await deleteTaskService(ctx.db, input.taskId);
      return { message: "Task deleted successfully" };
    })
});