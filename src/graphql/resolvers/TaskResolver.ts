import { Resolver, Authorized, Mutation, Arg, Ctx, Query } from "type-graphql";

import { ForbiddenError } from "apollo-server-core";

import { Task, TaskStatus } from "@graphql/types";

import { CreateTaskInput } from "@graphql/inputs/Task/CreateTaskInput";
import { UpdateTaskInput } from "@graphql/inputs/Task/UpdateTaskInput";

import { Context } from "@utils/context";

@Resolver()
export class TaskResolver {
    
    @Authorized()
    @Query(returns => [Task])
    async tasks(@Arg("board") boardId: number, @Ctx() ctx: Context) {
        const [board] = await ctx.prisma.board.findMany({
            where: {
                id: boardId,
                OR: [
                    {
                        authorId: ctx.user.id
                    },
                    {
                        users: {
                            every: {
                                id: ctx.user.id
                            }
                        }
                    }
                ]
            },
            include: {
                tasks: {
                    include: {
                        author: true,
                        board: true
                    }
                }
            }
        })

        if (!board) {
            throw new ForbiddenError("You dont have access to that board.");
        }

        return board.tasks;
    }

    @Authorized()
    @Mutation(returns => Task)
    async createTask(@Arg("board") boardId: number, @Arg("input") input: CreateTaskInput, @Ctx() ctx: Context) {
        const [board] = await ctx.prisma.board.findMany({
            where: {
                id: boardId,
                authorId: ctx.user.id
            }
        });

        if (!board) {
            throw new ForbiddenError("You cannot create a task on this board.");
        }

        const task = await ctx.prisma.task.create({
            data: {
                author: {
                    connect: { id: ctx.user.id },
                },
                board: {
                    connect: { id: board.id }
                },
                content: input.content,
                status: TaskStatus.PENDING,
                createdAt: new Date()
            },
            include: {
                author: true,
                board: true
            }
        });

        return task;
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async deleteTask(@Arg("id") taskId: number, @Ctx() ctx: Context) {
        const deleted = await ctx.prisma.task.deleteMany({
            where: {
                id: taskId,
                authorId: ctx.user.id
            }
        });

        if (deleted.count === 0) {
            throw new ForbiddenError("You cannot delete that task.");
        }

        return true
    }

    @Authorized()
    @Mutation(returns => Task)
    async updateTask(@Arg("id") taskId: number, @Arg("input") input: UpdateTaskInput, @Ctx() ctx: Context) {
        const [taskToUpdate] = await ctx.prisma.task.findMany({
            where: {
                id: taskId,
                authorId: ctx.user.id
            }
        });

        if (!taskToUpdate) {
            throw new ForbiddenError("You cannot update that task.");
        }

        const task = await ctx.prisma.task.update({
            where: { id: taskToUpdate.id },
            data: input,
            include: {
                author: true,
                board: true
            },
        });

        return task;
    }

    @Authorized()
    @Mutation(returns => Task)
    async updateTaskStatus(@Arg("id") taskId: number, @Arg("status") status: TaskStatus, @Ctx() ctx: Context) {
        const [taskToUpdate] = await ctx.prisma.task.findMany({
            where: {
                id: taskId,
                OR: [
                    {
                        authorId: ctx.user.id
                    },
                    {
                        board: {
                            users: {
                                every: { id: ctx.user.id}
                            }
                        }
                    }
                ]
            }
        });

        if (!taskToUpdate) {
            throw new ForbiddenError("You cannot update that task.");
        }

        const task = await ctx.prisma.task.update({
            where: { id: taskToUpdate.id },
            data: { status },
        });

        return task;
    }
}