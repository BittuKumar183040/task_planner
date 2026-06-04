import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { taskRouter } from "./routers/task";
import { teamRouter } from "./routers/team";
import { teamMemberRouter } from "./routers/teamMembers";
import { dashboardRouter } from "./routers/dashboard";
import { askChat } from "./chat/ask";

export const appRouter = createTRPCRouter({
  user: userRouter,
  task: taskRouter,
  team: teamRouter,
  dashboard: dashboardRouter,
  teamMember: teamMemberRouter,
  // ai routes
  ask: askChat,
});

export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? User[]
 */
export const createCaller = createCallerFactory(appRouter);
