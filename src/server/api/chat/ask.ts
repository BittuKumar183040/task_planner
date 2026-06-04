import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import {
  createTaskService,
  deleteTaskService,
  getTaskByIdService,
  getTasksService,
  getTeamTasksService,
  updateTaskService,
  updateTaskStatusService,
} from "~/server/service/task.service";
import { summarizeResult } from "~/server/api/chat/summarize";

const actions = [
  "about_me",
  "create_task",
  "update_task",
  "delete_task",
  "update_task_status",
  "get_task",
  "list_tasks",
  "list_team_tasks",
  "list_team_members",
  "list_projects",
  "project_summary",
  "unsupported",
] as const;

const SYSTEM_PROMPT = `
You are Tasky AI.

You are an AI assistant for a task management platform.

Allowed actions:
${actions.join(", ")}

Rules:
- Only help with task management.
- Extract the user's intent.
- Return the closest matching action.
- Never invent IDs.
- Never fabricate team members.
- Never fabricate projects.
- Never fabricate tasks.
- If the request is unrelated to task management return "unsupported".
`;

const ActionSchema = z.object({
  action: z.enum(actions),

  taskId: z.string().optional(),

  title: z.string().optional(),

  description: z.string().optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  status: z
    .enum(["new", "active", "completed"])
    .optional(),

  assigneeName: z.string().optional(),

  projectName: z.string().optional(),
});

export const askChat = createTRPCRouter({
  ask: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: ActionSchema,
        system: SYSTEM_PROMPT,
        prompt: input.question,
      });

      const action = result.object;

      switch (action.action) {
        case "about_me": {
          const response = await summarizeResult(
            input.question,
            ctx.session.user
          );

          return {
            type: "message",
            data: response,
            rawData: ctx.session.user,
          };
        }

        case "list_tasks": {
          const tasks = await getTasksService(
            ctx.db,
            input.teamId,
            ctx.session.user.id
          );

          const response = await summarizeResult(
            input.question,
            tasks
          );

          return {
            type: "message",
            data: response,
            rawData: tasks,
          };
        }

        case "list_team_tasks": {
          const tasks = await getTeamTasksService(
            ctx.db,
            input.teamId
          );

          const response = await summarizeResult(
            input.question,
            tasks
          );

          return {
            type: "message",
            data: response,
            rawData: tasks,
          };
        }

        case "get_task": {
          if (!action.taskId) {
            return {
              type: "message",
              data: "Please provide a task id.",
            };
          }

          const task = await getTaskByIdService(
            ctx.db,
            action.taskId
          );

          const response = await summarizeResult(
            input.question,
            task
          );

          return {
            type: "message",
            data: response,
            rawData: task,
          };
        }

        case "create_task": {
          if (!action.title) {
            return {
              type: "message",
              data: "Please provide a task title.",
            };
          }

          const task = await createTaskService(
            ctx.db,
            ctx.session.user.id,
            {
              title: action.title,
              description: action.description,
              teamId: input.teamId,
              priority: action.priority ?? "medium",
              status: action.status ?? "new",
            }
          );

          const response = await summarizeResult(
            input.question,
            task
          );

          return {
            type: "message",
            data: response,
            rawData: task,
          };
        }

        case "update_task": {
          if (!action.taskId) {
            return {
              type: "message",
              data: "Please provide a task id.",
            };
          }

          const task = await updateTaskService(
            ctx.db,
            ctx.session.user.id,
            action.taskId,
            {
              title: action.title ?? "",
              description: action.description,
              assignedToId: undefined,
              priority: action.priority,
              status: action.status,
              deadline: undefined,
              tags: undefined,
            }
          );

          const response = await summarizeResult(
            input.question,
            task
          );

          return {
            type: "message",
            data: response,
            rawData: task,
          };
        }

        case "update_task_status": {
          if (!action.taskId) {
            return {
              type: "message",
              data: "Please provide a task id.",
            };
          }

          if (!action.status) {
            return {
              type: "message",
              data: "Please provide a task status.",
            };
          }

          const task = await updateTaskStatusService(
            ctx.db,
            action.taskId,
            action.status
          );

          const response = await summarizeResult(
            input.question,
            task
          );

          return {
            type: "message",
            data: response,
            rawData: task,
          };
        }

        case "delete_task": {
          if (!action.taskId) {
            return {
              type: "message",
              data: "Please provide a task id.",
            };
          }

          const result = await deleteTaskService(
            ctx.db,
            action.taskId
          );

          const response = await summarizeResult(
            input.question,
            result
          );

          return {
            type: "message",
            data: response,
            rawData: result,
          };
        }

        case "list_team_members": {
          const members = await ctx.db.teamMember.findMany({
            where: {
              teamId: input.teamId,
            },
            include: {
              user: true,
            },
          });

          const response = await summarizeResult(
            input.question,
            members
          );

          return {
            type: "message",
            data: response,
            rawData: members,
          };
        }

        case "list_projects":
        case "project_summary": {
          return {
            type: "message",
            data:
              "Project operations are not implemented yet.",
          };
        }

        case "unsupported": {
          return {
            type: "message",
            data:
              "I can only assist with task management operations.",
          };
        }

        default: {
          return {
            type: "message",
            data:
              "Sorry, I couldn't understand your request.",
          };
        }
      }
    }),
});