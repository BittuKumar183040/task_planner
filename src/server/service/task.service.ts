import { type PrismaClient } from "@prisma/client";

export type CreateTaskInput = {
  title: string;
  description?: string;
  assignedToId?: string;
  teamId: string;
  priority?: "low" | "medium" | "high";
  status?: "new" | "active" | "completed";
  deadline?: Date;
  tags?: string[];
};

export async function createTaskService(
  db: PrismaClient,
  userId: string,
  input: CreateTaskInput
) {
  return db.task.create({
    data: {
      ...input,
      createdById: userId,
    },
  });
}

export async function updateTaskService(
  db: PrismaClient,
  userId: string,
  taskId: string,
  input: Omit<CreateTaskInput, "teamId">
) {
  return db.task.update({
    where: { id: taskId },
    data: {
      ...input,
      createdById: userId,
    },
  });
}

export async function updateTaskStatusService(
  db: PrismaClient,
  taskId: string,
  status: "new" | "active" | "completed"
) {
  return db.task.update({
    where: { id: taskId },
    data: {
      status,
    },
  });
}

export async function getTaskByIdService(db: PrismaClient, taskId: string) {
  return db.task.findUnique({
    where: { id: taskId },
    include: {
      assignedTo: {
        select: { id: true, username: true, image: true },
      },
      createdBy: {
        select: { id: true, username: true, image: true },
      },
    },
  });
}

export async function getTasksService(db: PrismaClient, teamId: string, userId: string) {
  return db.task.findMany({
    where: {
      teamId,
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
}

export async function getTeamTasksService(db: PrismaClient, teamId: string) {
  return db.task.findMany({
    where: {
      teamId,
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
}

export async function deleteTaskService(db: PrismaClient, taskId: string) {
  return db.task.delete({
    where: { id: taskId },
  });
}