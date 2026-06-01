import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getOverview: protectedProcedure
    .input( z.object({ teamId: z.string()}))
    .query(async ({ ctx, input }) => { 
      const userId = ctx.session.user.id;

      const [ assignedTasks, createdTasks, completedTasks, teamMembers ] = await Promise.all([
        ctx.db.task.count({
          where: { teamId: input.teamId, assignedToId: userId },
        }),
        ctx.db.task.count({ where: { teamId: input.teamId, createdById: userId } }),
        ctx.db.task.count({ where: { teamId: input.teamId, assignedToId: userId, status: "completed" } }),
        ctx.db.teamMember.count({ where: { teamId: input.teamId}}),
      ]);

      const statusBreakdown = await ctx.db.task.groupBy({
        by: ["status"],
        where: { teamId: input.teamId, assignedToId: userId },
        _count: true,
      });

      const priorityBreakdown = await ctx.db.task.groupBy({
        by: ["priority"],
        where: { teamId: input.teamId, assignedToId: userId },
        _count: true,
      });

      return { assignedTasks, createdTasks, completedTasks, teamMembers, statusBreakdown, priorityBreakdown };
    }),
});