import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { taskRouter } from "./routers/task";

export const appRouter = createTRPCRouter({
  user: userRouter,
  task: taskRouter,
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
