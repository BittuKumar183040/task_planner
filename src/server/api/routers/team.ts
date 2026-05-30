import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getUserTeams: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const teams = await ctx.db.teamMember.findMany({
      where: { userId },
      include:{
        team: {
          select: {
            name: true,
            description: true,
            _count: {select: { members: true}}
          } 
        }
      }
    });
    return teams;
  }),
  createTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const teamId = input.teamId;
      const teamMember = await ctx.db.teamMember.create({
        data: {
          userId,
          teamId,
        },
      });
      return teamMember;
    })
});