import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type PrismaClient } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

const getUserTeams = async (db: PrismaClient, userId: string) => {
  const teams = await db.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        select: {
          name: true,
          description: true,
          teamCode: true,
          _count: { select: { members: true } },
        },
      },
    },
  });

  return teams.map((t) => ({
    ...t,
    team: { ...t.team, teamCode: t.role === "admin" ? t.team.teamCode : null },
  }));
};


export const teamRouter = createTRPCRouter({
  getUserTeams: protectedProcedure.query(async ({ ctx }) => {
    return getUserTeams(ctx.db, ctx.session.user.id);
  }),
  createTeam: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string(), teamCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const team = await ctx.db.team.create({
        data: { name: input.name, description: input.description, teamCode: input.teamCode },
      });
      const teamMember = await ctx.db.teamMember.create({
        data: { userId, teamId: team.id, role: "admin" },
      });

      return { team, ...teamMember };
    }),
  joinTeam: protectedProcedure
    .input(z.object({ teamCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const team = await ctx.db.team.findUnique({
        where: { teamCode: input.teamCode },
      });

      if (!team) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid team code" });

      const existing = await ctx.db.teamMember.findUnique({
        where: { teamId_userId: { teamId: team.id, userId } },
      });

      if (existing) throw new TRPCError({ code: "CONFLICT", message: "You are already a member of this team" });

      const teamMember = await ctx.db.teamMember.create({
        data: { userId, teamId: team.id },
      });

      return { team, ...teamMember };
    }),
  deleteTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const membership = await ctx.db.teamMember.findUnique({
        where: { teamId_userId: { teamId: input.teamId, userId } },
      });

      if (!membership) throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
      if (membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete a team" });

      await ctx.db.$transaction([
        ctx.db.teamMember.deleteMany({ where: { teamId: input.teamId } }),
        ctx.db.task.deleteMany({ where: { teamId: input.teamId } }),
        ctx.db.team.delete({ where: { id: input.teamId } }),
      ]);

      return getUserTeams(ctx.db, userId);
    }),
});