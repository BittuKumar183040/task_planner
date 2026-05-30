import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const teamMemberRouter = createTRPCRouter({
  getTeamMemberCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const teams = await ctx.db.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            _count: { select: { members: true } },
          },
        },
      },
    });

    return teams;
  }),

  getTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await ctx.db.teamMember.findMany({
        where: { teamId: input.teamId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              email: true,
            },
          },
        },
      });

      return members.map((m) => m.user);
    }),

});